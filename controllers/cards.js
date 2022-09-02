const Card = require('../models/card');

const NotFoundError = require('../errors/notFoundError');
const ValidateError = require('../errors/validateError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidateError('Переданы некорректные данные в методы создания карточки'));
        return;
      }
      next();
    });
};

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  console.log(req.owner);
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card.owner.toString === req.user._id) {
        throw new Error('Эту карточку нельзя удалить');
      } else {
        return res.send(card);
      }
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
      } else if (err.name === 'CastError') {
        next(new ValidateError('Передан некорректный id карточки'));
        return;
      }
      next();
    });
};

module.exports.likeCard = (req, res, next) => {
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
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
      } else if (err.name === 'CastError') {
        next(new ValidateError('Передан некорректный id карточки'));
        return;
      }
      next();
    });
};

module.exports.dislikeCard = (req, res, next) => {
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
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
      } else if (err.name === 'CastError') {
        next(new ValidateError('Передан некорректный id карточки'));
        return;
      }
      next();
    });
};
