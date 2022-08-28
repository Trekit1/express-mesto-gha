const Card = require('../models/card');

const {
  validationErrorCode,
  notFoundErrorCode,
  defaultErrorCode,
} = require('../Errors');

module.exports.createCard = (req, res) => {
  console.log(req.user._id);

  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationErrorCode).send({
          message: 'Переданы некорректные данные в методы создания карточки',
        });
      } else {
        res
          .status(defaultErrorCode)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res
      .status(defaultErrorCode)
      .send({ message: 'На сервере произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res
          .status(notFoundErrorCode)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      } else if (err.name === 'CastError') {
        res
          .status(validationErrorCode)
          .send({ message: 'Передан некорректный id карточки' });
      } else {
        res.status(defaultErrorCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res
          .status(notFoundErrorCode)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      } else if (err.name === 'CastError') {
        res
          .status(validationErrorCode)
          .send({ message: 'Передан некорректный id карточки' });
      } else {
        res.status(defaultErrorCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res
          .status(notFoundErrorCode)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      } else if (err.name === 'CastError') {
        res
          .status(validationErrorCode)
          .send({ message: 'Передан некорректный id карточки' });
      } else {
        res.status(defaultErrorCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
