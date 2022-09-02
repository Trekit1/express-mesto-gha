const { celebrate, Joi } = require('celebrate');

const routerUser = require('express').Router();
const { getAllUsers } = require('../controllers/users');
const { getUser } = require('../controllers/users');
const { updateUserProfile } = require('../controllers/users');
const { updateUserAvatar } = require('../controllers/users');
const { getUserInfo } = require('../controllers/users');

routerUser.get('/', getAllUsers);
routerUser.get('/me', getUserInfo);
routerUser.get('/:userId', getUser);
routerUser.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserProfile,
);
routerUser.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(/https?:\/\/(www\.)?[a-z0-9\-._~:/?#[]@!&'(),;=]/i),
    }),
  }),
  updateUserAvatar,
);

module.exports = routerUser;
