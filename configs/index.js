require('dotenv').config();

const {
  NODE_ENV, PORT, JWT_SECRET, DB_URL,
} = process.env;
const isProd = NODE_ENV === 'production';
const port = (isProd && PORT) ? PORT : '3000';
const jwtSecret = (isProd && JWT_SECRET) ? JWT_SECRET : 'super-secret-Word';
const dbUrl = (isProd && DB_URL) ? DB_URL : 'news-explorer';

module.exports = {
  PORT: port,
  JWT_SECRET: jwtSecret,
  DB_URL: dbUrl,
};
