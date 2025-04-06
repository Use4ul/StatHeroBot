const config = require('../../config.json');
const { dbConnection } = require('./index');
const { dataBaseLogger, syncLogger } = require('../../logger');

module.exports = async (options = {}) => {
    const defaultOptions = {
        alter: process.env.NODE_ENV === 'development',
        force: false,
        logging: (sql, timing) => {
            dataBaseLogger.debug(`[SQL] ${sql} | ${timing}ms`);
        },
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
        syncLogger.info('Starting database sync with options:', finalOptions);
        await dbConnection.sync(finalOptions);
        syncLogger.info('Database synced successfully');
        return true;
    } catch (error) {
        syncLogger.warn('Database sync failed:', error);
        throw error;
    }
};
