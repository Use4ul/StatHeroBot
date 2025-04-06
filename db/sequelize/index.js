const config = require('../../config.json');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const { dataBaseLogger } = require('../../logger');

const database = config?.settings?.database;
const databaseSettings = config?.DB[database];
const auth = config?.auth[`${databaseSettings.user}`];

// Инициализация Sequelize
const dbConnection = new Sequelize(databaseSettings?.database, auth?.login, auth?.password, {
    host: databaseSettings.host,
    port: databaseSettings.port,
    dialect: databaseSettings.dialect,
    logging: databaseSettings.logging
        ? (sql, timing) => {
              dataBaseLogger.debug(`[SQL] ${sql} | ${timing}ms`);
          }
        : false,
    benchmark: true,
    pool: 'tcp',
});

// Автоматический импорт моделей
const Models = {};
const modelsPath = path.join(__dirname, './models');

require('fs')
    .readdirSync(modelsPath)
    .filter((file) => file.endsWith('.model.js'))
    .forEach((file) => {
        const model = require(path.join(modelsPath, file))(dbConnection, DataTypes);
        Models[model.name] = model;
    });

// Установка ассоциаций
Object.values(Models).forEach((model) => {
    if (model.associate) {
        model.associate(Models);
    }
});

// Проверка подключения
(async () => {
    try {
        await dbConnection.authenticate();
        dataBaseLogger.info('Database connection established successfully.');
    } catch (error) {
        dataBaseLogger.error('Unable to connect to the database:', error);
        process.exit(1);
    }
})();

module.exports = {
    Sequelize,
    dbConnection,
    ...Models
};
