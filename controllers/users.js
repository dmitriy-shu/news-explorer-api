const userModel = require('../models/user');
const { NotFoundError } = require('../errors/not-found-error.js');
const { ValidationError } = require('../errors/validationerror.js');

module.exports.getUser = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('нет пользователя с таким id');
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new ValidationError('данные переданные пользователем некорректны'));
      } else if (err.statusCode === 404) {
        next(err);
      } else {
        next(err);
      }
    });
};
