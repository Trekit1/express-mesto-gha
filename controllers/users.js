const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const AuthenticationError = require('../errors/authenticationErrorCode');
const NotFoundError = require('../errors/notFoundError');
const ValidateError = require('../errors/validateError');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
      res
        .cookie('jwt', token, {
          httpOnly: true,
        });
    })
    .catch(() => {
      next(new AuthenticationError('Ошибка при попытке залогиниться'));
    });
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, password, email,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, password: hash, email,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({ message: 'Такой пользователь уже существует' });
      } if (err.name === 'ValidationError') {
        return next(new ValidateError('Переданы некорректные данные в методы создания пользователя'));
      }
      return next();
    });
};

module.exports.getUser = (req, res, next) => {
  console.log(req.params);
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else if (err.name === 'CastError') {
        next(new ValidateError('Передан некорректный id'));
        return;
      }
      next();
    });
};

module.exports.getUserInfo = (req, res, next) => {
  console.log(req.params);
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidateError('Переданы некорректные данные в методы обновления пользователя'));
        return;
      }
      next();
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidateError('Переданы некорректные данные в методы обновления пользователя'));
        return;
      }
      next();
    });
};
