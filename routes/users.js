const routerUser = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getAllUsers } = require('../controllers/users');
const { getUser } = require('../controllers/users');
const { updateUserProfile } = require('../controllers/users');
const { updateUserAvatar } = require('../controllers/users');
const { getUserInfo } = require('../controllers/users');
const { reg } = require('../constants');

routerUser.get('/', getAllUsers);
routerUser.get('/me', getUserInfo);
routerUser.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserProfile);
routerUser.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(reg),
  }),
}), updateUserAvatar);
routerUser.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).hex(),
  }),
}), getUser);

module.exports = routerUser;
