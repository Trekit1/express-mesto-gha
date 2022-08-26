const express = require('express');

const mongoose = require('mongoose');

const {
  notFoundErrorCode,
} = require('./Errors');

const app = express();
const { PORT = 3000 } = process.env;
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '62febaa6966f23e823295f96',
  };

  next();
});

app.use('/users', routerUser);

app.use('/cards', routerCard);

app.use('/', (req, res) => {
  res.status(notFoundErrorCode).send({ message: 'Данная страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
