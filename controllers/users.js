const User = require('../models/user');

const {
  validationErrorCode,
  defaultErrorCode,
} = require('../Errors');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res
      .status(defaultErrorCode)
      .send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationErrorCode).send({
          message:
            'Переданы некорректные данные в методы создания пользователя',
        });
      } else {
        res
          .status(defaultErrorCode)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error();
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'Error') {
        res
          .status(validationErrorCode)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res
          .status(defaultErrorCode)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(validationErrorCode)
          .send({ message: 'Переданы некорректные данные в методы обновления пользователя' });
      } else {
        res
          .status(defaultErrorCode)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(validationErrorCode)
          .send({ message: 'Переданы некорректные данные в методы обновления аватара пользователя' });
      } else {
        res
          .status(defaultErrorCode)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};
