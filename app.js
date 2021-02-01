const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const Routers = require('./routes/index.js');
const { reqLogger, errLogger } = require('./middlewares/logger.js');
const { NotFoundError } = require('./errors/not-found-error.js');
const { PORT, DB_URL } = require('./configs/index.js');

const app = express();

mongoose.connect(`mongodb://localhost:27017/${DB_URL}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(reqLogger);

app.use('/', Routers);

app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT);
