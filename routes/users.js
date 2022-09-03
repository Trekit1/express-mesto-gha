const routerUser = require('express').Router();
const { createUser } = require('../controllers/users');
const { getAllUsers } = require('../controllers/users');
const { getUser } = require('../controllers/users');
const { updateUserProfile } = require('../controllers/users');
const { updateUserAvatar } = require('../controllers/users');

routerUser.post('/', createUser);
routerUser.get('/', getAllUsers);
routerUser.get('/:userId', getUser);
routerUser.patch('/me', updateUserProfile);
routerUser.patch('/me/avatar', updateUserAvatar);

module.exports = routerUser;
