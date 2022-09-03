const routerUser = require('express').Router();
const { getAllUsers } = require('../controllers/users');
const { getUser } = require('../controllers/users');
const { updateUserProfile } = require('../controllers/users');
const { updateUserAvatar } = require('../controllers/users');
const { getUserInfo } = require('../controllers/users');

routerUser.get('/', getAllUsers);
routerUser.get('/me', getUserInfo);
routerUser.patch('/me', updateUserProfile);
routerUser.patch('/me/avatar', updateUserAvatar);
routerUser.get('/:userId', getUser);

module.exports = routerUser;
