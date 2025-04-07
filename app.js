const { mainLogger, dataBaseLogger } = require('./logger');
const initializeDatabase = require('./dbInit');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Импортируем модель User
const { User } = require('./db/sequelize/index');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
    mainLogger?.info(`${req.method} ${req.url}`);
    next();
});

app.get('/data', async (req, res) => {
    const users = await User.findAll()

    res.json({ data: users, message: 'Data API', timestamp: Date.now() });
});

// Обработка 404 (если маршрут не найден)
app.use((req, res) => {
    res.status(404).send('Страница не найдена 🔍');
});

// Обработка ошибок
app.use((err, req, res, next) => {
    mainLogger?.error('Error:', err.message);
    res.status(500).send('Server error ⚠️');
});

const bootstrap = async () => {
    try {
        // Инициализация БД
        await initializeDatabase();
        mainLogger.info('DB initialization complited successfully');

        // Запуск приложения
        startWebServer();
    } catch (error) {
        handleStartupError();
        mainLogger.error('Application startup failed:', error);
    }
};

function startWebServer() {
    app.listen(PORT, () => {
        mainLogger.info(`Server running on port ${PORT}`);
    });
}

function handleStartupError(error) {
    dataBaseLogger.fatal('Startup failed:', error);
    process.exit(1);
}

bootstrap();
