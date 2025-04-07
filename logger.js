const log4js = require('log4js');
const path = require('path');

log4js.configure({
    appenders: {
        console: { type: 'console' },
        main: {
            type: 'file',
            filename: path.join(__dirname, './logs/main.log'),
            maxLogSize: 5242880,
            backups: 7,
            layout: {
                type: 'pattern',
                pattern: '%d{yyyy-MM-dd hh:mm:ss} [%p] %m',
            },
        },
        database: {
            type: 'file',
            filename: path.join(__dirname, './logs/dataBase.log'),
            maxLogSize: 5242880,
            backups: 7,
            layout: {
                type: 'pattern',
                pattern: '%d{yyyy-MM-dd hh:mm:ss} [%p] %m',
            },
        },
        sync: {
            type: 'file',
            filename: path.join(__dirname, './logs/sync.log'),
            maxLogSize: 5242880,
            backups: 7,
            layout: {
                type: 'pattern',
                pattern: '%d{yyyy-MM-dd hh:mm:ss} [%p] %m',
            },
        },
    },
    categories: {
        default: { appenders: ['console', 'main'], level: 'info' },
        database: { appenders: ['database'], level: 'debug' },
        sync: { appenders: ['sync', 'console'], level: 'info' },
    },
});

module.exports = {
    mainLogger: log4js.getLogger(),
    dataBaseLogger: log4js.getLogger('database'),
    syncLogger: log4js.getLogger('sync'),
};
