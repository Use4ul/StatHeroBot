// logger.js
const log4js = require('log4js');

// Базовая настройка
log4js.configure({
    appenders: {
        console: { type: 'console' }, // Вывод в консоль
        file: {
            type: 'file',
            filename: 'logs/app.log', // Файл для логов
            maxLogSize: 10_485_760, // 10 MB
            backups: 5, // 5 резервных копий
        },
    },
    categories: {
        default: { appenders: ['console', 'file'], level: 'info' },
    },
});

// Экспорт логгера
module.exports = log4js.getLogger();
