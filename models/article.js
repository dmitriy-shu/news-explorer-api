const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /(http|https):\/\/(www)?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]{1,}#?/.test(v),
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /(http|https):\/\/(www)?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]{1,}#?/.test(v),
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    select: false,
  },
});

module.exports = mongoose.model('article', articleSchema);
