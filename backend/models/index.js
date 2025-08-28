const sequelize = require('../config/db');
const User = require('./user')(sequelize);

module.exports = { sequelize, User };
