const jwt = require('jsonwebtoken');

const BadTokenError = require('../errors/BadTokenError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new BadTokenError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new BadTokenError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
