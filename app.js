const express = require('express');

const mongoose = require('mongoose');

const {
  notFoundErrorCode,
} = require('./Errors');

const app = express();
const { PORT = 3000 } = process.env;
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');

const { login, createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.post('/signin', login);

app.post('/signup', createUser);

app.use(auth);

app.use('/users', routerUser);

app.use('/cards', routerCard);

app.use('/', (req, res) => {
  res.status(notFoundErrorCode).send({ message: 'Данная страница не найдена' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
