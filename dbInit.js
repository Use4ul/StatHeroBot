const { dataBaseLogger } = require('./logger');
const syncDatabase = require('./db/sequelize/sync');
const seedDatabase = require('./db/sequelize/seeds');

/**
 * Инициализирует базу данных (синхронизация + заполнение тестовыми данными)
 */
const initializeDatabase = async () => {
    try {
        dataBaseLogger.info('Starting database initialization...');

        // Синхронизация структуры БД
        await syncDatabase({
            alter: true,
            logging: (sql, timing) => {
                dataBaseLogger.debug(`[SQL] ${sql} | ${timing}ms`);
            },
        });

        // Заполнение тестовыми данными
        await seedDatabase({
            cleanBeforeSeed: false,
            specificSeeds: ['user', 'product'],
            logging: true,
        });

        dataBaseLogger.info('Database initialized successfully');
        return true;
    } catch (error) {
        dataBaseLogger.error('Database initialization failed:', {
            message: error.message,
            stack: error.stack,
        });
        throw error;
    }
};

module.exports = initializeDatabase;
