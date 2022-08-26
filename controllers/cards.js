const Card = require('../models/card');

const validationErrorCode = 400;
const notFoundErrorCode = 404;
const defaultErrorCode = 500;

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
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(notFoundErrorCode)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res
          .status(defaultErrorCode)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(notFoundErrorCode)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res
          .status(defaultErrorCode)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(notFoundErrorCode)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      } else {
        res
          .status(defaultErrorCode)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};
