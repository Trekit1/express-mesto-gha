const routerCard = require('express').Router();
const { createCard } = require('../controllers/cards');
const { getAllCards } = require('../controllers/cards');
const { deleteCard } = require('../controllers/cards');
const { likeCard } = require('../controllers/cards');
const { dislikeCard } = require('../controllers/cards');

routerCard.post('/', createCard);
routerCard.get('/', getAllCards);
routerCard.delete('/:cardId', deleteCard);
routerCard.put('/:cardId/likes', likeCard);
routerCard.delete('/:cardId/likes', dislikeCard);

module.exports = routerCard;
