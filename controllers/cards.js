const Card = require('../models/card');

const ValidError = require('../errors/ValidError');
const NotFoundError = require('../errors/NotFoundError');
const NotAccessError = require('../errors/NotAccessError');

module.exports.createCard = (req, res, next) => {
  console.log(req.user._id);

  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidError('Переданы некорректные данные в методы создания карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Данная карточка не существует');
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.deleteOne(card)
          .then(() => {
            res.send({ message: 'Карточка удалена' });
          })
          .catch(next);
      } else {
        throw new NotAccessError('Нет прав для удаления карточки');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidError('Передан некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Данная карточка не существует');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidError('Передан некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Данная карточка не существует');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidError('Передан некорректный id карточки'));
      } else {
        next(err);
      }
    });
};
