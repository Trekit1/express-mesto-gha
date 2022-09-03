const express = require('express');

const { celebrate, Joi } = require('celebrate');

const mongoose = require('mongoose');

const app = express();
const { PORT = 3000 } = process.env;
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const NotFoundError = require('./errors/NotFoundError');
const { login, createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/users', routerUser);

app.use('/cards', routerCard);

app.use('/', (req, res, next) => {
  next(new NotFoundError('Данная страница не найдена'));
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
