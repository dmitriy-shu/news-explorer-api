const articleModel = require('../models/article');
const { NotFoundError } = require('../errors/not-found-error.js');
const { Forbiden } = require('../errors/forbiden.js');

module.exports.getArticles = (req, res, next) => {
  const owner = req.user._id;
  articleModel.find({ owner })
    .then((data) => {
      res.send(data);
    })
    .catch((next));
};

module.exports.saveArticle = (req, res, next) => {
  const owner = req.user._id;
  articleModel.create({ owner, ...req.body })
    .then((data) => {
      const {
        keyword, title, text, date, source, link, image,
      } = data;
      res.send({
        keyword, title, text, date, source, link, image,
      });
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  const _id = req.params.articleId;
  const owner = req.user._id;
  articleModel.findById(_id)
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Нет такой');
      }
      articleModel.find({ owner, _id })
        .then((articleOwner) => {
          if (!articleOwner[0]) {
            throw new Forbiden('Ты не владелец');
          }
          articleModel.findByIdAndRemove(_id)
            .then((trueArticle) => {
              res.send(trueArticle);
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
};
