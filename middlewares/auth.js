const jwt = require('jsonwebtoken');

const { authenticationErrorCode } = require('../Errors');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(authenticationErrorCode)
      .send({ message: 'Необходимо авторизироваться' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(authenticationErrorCode)
      .send({ message: 'Необходимо авторизироваться' });
  }

  req.user = payload;

  return next();
};
