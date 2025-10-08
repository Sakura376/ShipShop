const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// 1) Crear el contenedor primero
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 2) Registrar modelos
db.User        = require('./user')(sequelize, DataTypes);
db.Product     = require('./product')(sequelize, DataTypes);
db.PendingUser = require('./pending_user')(sequelize, DataTypes);
db.Order       = require('./order')(sequelize, DataTypes);
db.OrderDetail = require('./order_detail')(sequelize, DataTypes);
db.ProductRating = require('./product_Rating')(sequelize, DataTypes);
db.PendingReset = require('./pending_reset')(sequelize, DataTypes);
db.PaymentIntent = require('./payment_intent')(sequelize, DataTypes);

// 3) Relaciones
db.Order.hasMany(db.OrderDetail,   { foreignKey: 'order_id' });
db.OrderDetail.belongsTo(db.Order, { foreignKey: 'order_id' });

db.Product.hasMany(db.OrderDetail,   { foreignKey: 'product_id' });
db.OrderDetail.belongsTo(db.Product, { foreignKey: 'product_id' });

db.Product.hasMany(db.ProductRating, { foreignKey: 'product_id' });
db.ProductRating.belongsTo(db.Product, { foreignKey: 'product_id' });

db.User.hasMany(db.ProductRating, { foreignKey: 'user_id' });
db.ProductRating.belongsTo(db.User, { foreignKey: 'user_id' });

db.Order.hasMany(db.PaymentIntent, { foreignKey: 'order_id' });
db.PaymentIntent.belongsTo(db.Order, { foreignKey: 'order_id' });

// 4) Exportar
module.exports = db;
