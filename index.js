require('dotenv').config(); // Загрузка переменных окружения из .env
const express = require('express');
const logger = require('./logger'); // Подключение логгера (если есть)

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Для парсинга JSON
app.use(express.urlencoded({ extended: true })); // Для данных из форм
app.use(express.static('public')); // Раздача статики (css, js, изображения)

// Логирование запросов (если подключен log4js)
app.use((req, res, next) => {
    logger?.info(`${req.method} ${req.url}`);
    next();
});

app.get('/api/data', (req, res) => {
    res.json({ message: 'Данные API', timestamp: Date.now() });
});

// Обработка 404 (если маршрут не найден)
app.use((req, res) => {
    res.status(404).send('Страница не найдена 🔍');
});

// Обработка ошибок
app.use((err, req, res, next) => {
    logger?.error('Ошибка:', err.message);
    res.status(500).send('Ошибка сервера ⚠️');
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    logger?.info(`Сервер запущен на порту ${PORT}`);
});
