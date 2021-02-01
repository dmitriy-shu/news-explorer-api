const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');
const { Unauthorized } = require('../errors/unauthorized.js');
const { ValidationError } = require('../errors/validationerror.js');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  if (!email || !password) {
    throw new ValidationError('Введенные данные некорректны');
  }
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Неверные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized('Неверные почта или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
