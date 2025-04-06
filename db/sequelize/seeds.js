const path = require('path');
const { syncLogger } = require('../../logger');
const { dbConnection } = require('./index');

module.exports = async (options = {}) => {
    const defaultOptions = {
        cleanBeforeSeed: false,
        specificSeeds: null, // ['user', 'product']
        seedOrder: ['user', 'product'], // Порядок выполнения
        logging: true,
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
        if (finalOptions.cleanBeforeSeed) {
            await dbConnection.sync({ force: true });
            syncLogger.warn('Database cleaned before seeding');
        }

        // Загрузка всех seed-файлов
        const seeds = {};
        const seedsPath = path.join(__dirname, 'models_seeds');

        require('fs')
            .readdirSync(seedsPath)
            .filter((file) => file.endsWith('.seed.js'))
            .forEach((file) => {
                const seedName = file.replace('.seed.js', '');
                seeds[seedName] = require(path.join(seedsPath, file));
            });

        // Выполнение сидов в указанном порядке
        const seedsToRun = finalOptions.specificSeeds || finalOptions.seedOrder;

        for (const seedName of seedsToRun) {
            if (seeds[seedName]) {
                if (finalOptions.logging) {
                    syncLogger.info(`Running seed: ${seedName}`);
                }
                await seeds[seedName]();
            }
        }

        syncLogger.info('All seeds completed successfully');
        return true;
    } catch (error) {
        syncLogger.error('Seeding process failed:', error);
        throw error;
    }
};
