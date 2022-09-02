const express = require('express');

const { celebrate, Joi } = require('celebrate');

const mongoose = require('mongoose');

const { errors } = require('celebrate');

const {
  notFoundErrorCode,
} = require('./Errors');

const app = express();
const { PORT = 3000 } = process.env;
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(www\.)?([a-zA-Z0-9-._~:/?#[]@!\$&'()\*\+,;=]#?)/),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(www\.)?([a-zA-Z0-9-._~:/?#[]@!\$&'()\*\+,;=]#?)/),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/users', routerUser);

app.use('/cards', routerCard);

app.use('/', (req, res) => {
  res.status(notFoundErrorCode).send({ message: 'Данная страница не найдена' });
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
