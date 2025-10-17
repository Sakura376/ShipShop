const { Sequelize } = require('sequelize');

const dialect = process.env.DB_DIALECT || 'mysql';
const storage = process.env.DB_STORAGE;

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect,
    storage,   // usado por sqlite
    logging: false,
  }
);

module.exports = sequelize;
