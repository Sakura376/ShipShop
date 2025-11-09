const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // ← usa la instancia ya creada

const db = {};

// Carga de modelos (cada archivo exporta (sequelize, DataTypes) => Model)
db.User           = require('./user')(sequelize, DataTypes);
db.Product        = require('./product')(sequelize, DataTypes);
db.Order          = require('./order')(sequelize, DataTypes);
db.OrderDetail    = require('./order_detail')(sequelize, DataTypes);
db.PaymentIntent  = require('./payment_intent')(sequelize, DataTypes);
db.PendingReset   = require('./pending_reset')(sequelize, DataTypes);
db.PendingUser    = require('./pending_user')(sequelize, DataTypes);
db.ProductRating  = require('./product_rating')(sequelize, DataTypes); // nombre correcto

// ===== Relaciones =====
db.User.hasMany(db.Order, { foreignKey: 'user_id' });
db.Order.belongsTo(db.User, { foreignKey: 'user_id' });

db.Order.hasMany(db.OrderDetail, { foreignKey: 'order_id' });
db.OrderDetail.belongsTo(db.Order, { foreignKey: 'order_id' });

db.Product.hasMany(db.OrderDetail, { foreignKey: 'product_id' });
db.OrderDetail.belongsTo(db.Product, { foreignKey: 'product_id' });

db.Product.hasMany(db.ProductRating, { foreignKey: 'product_id' });
db.ProductRating.belongsTo(db.Product, { foreignKey: 'product_id' });

db.User.hasMany(db.ProductRating, { foreignKey: 'user_id' });
db.ProductRating.belongsTo(db.User, { foreignKey: 'user_id' });

db.sequelize = sequelize;

module.exports = db;
