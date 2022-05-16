const express = require('express'); // Express - библиотека для создания HTTP-сервера.
const cors = require('cors'); // CORS нужно для выполнения запросов с иных источников (гуглите CORS).

const PORT = 80;

const app = express(); // создаём обхект приложения.
app.use(express.json()); // добавляем промежуточный обработчик для парсинга тела запроса как JSON.
app.use(cors()); // подключаем промежуточный обработчик CORS.
app.use(express.static('../client'));

// Создадим глобальную переменную для хранения списка сообщений.
const messages = [];
// При развитииприложения её надо заменить на обращение к БД.

// Зарегистрируем обработчик POST запроса для отправки сообщения пользователем.
app.post('/api/messages', (req, res) => {
    const { text, author } = req.body; // Вытащим из тела запроса имя автора и текст.
    if (!text) {
        res.status(400).send('You can\'t send empty messages.');
        return;
    }
    if (!author) {
        res.status(400).send('You must fill the autor field.');
        return;
    }
    // Создадим объект сообщения для добавления в нашу "БД".
    const message = {
        text,
        author,
        timestamp: new Date().toISOString(),
    };
    // Добавим сообщение в локальны массив (нашу "БД").
    messages.push(message);
    // Уведомим клиента об успешном выполнении операции.
    res.sendStatus(200);
});

// Зарегистрируем обработчик для запроса на получение списка всех уведомлений в системе.
app.get('/api/messages', (req, res) => {
    res.json(messages); // Вернём клиенту список всех сообщений из локального массива, серилизаованный в строку JSON.
});

// Начнём слушать входящие соединения и выведем сообщение об этом в консоль.
app.listen(PORT);
console.log(`App is up and running on port ${PORT}`);