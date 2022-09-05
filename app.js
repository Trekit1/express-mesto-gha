const express = require('express');

const mongoose = require('mongoose');

const { errors } = require('celebrate');

const app = express();
const { PORT = 3000 } = process.env;

const errorHandling = require('./middlewares/errorHandling');

mongoose.connect('mongodb://localhost:27017/mestodb');

const router = require('./routes/index');

app.use(express.json());

app.use(router);

app.use(errors());

app.use(errorHandling);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
