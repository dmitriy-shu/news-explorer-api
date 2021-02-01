const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouters = require('./users');
const articleRouters = require('./articles');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/login.js');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

router.use('/users', auth, userRouters);

router.use('/articles', auth, articleRouters);

module.exports = router;
