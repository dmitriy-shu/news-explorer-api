const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ValidationError } = require('../errors/validationerror.js');
const { DataError } = require('../errors/dataError.js');
const userModel = require('../models/user.js');
const { JWT_SECRET } = require('../configs/index.js');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      if (!user) {
        throw new ValidationError('Данные переданные пользователем некорректны');
      }

      res.send({ name, email });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new DataError('Такой пользователь уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError('Данные переданные пользователем некорректны'));
      } else {
        next(err);
      }
    });
};
