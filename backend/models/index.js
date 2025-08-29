// backend/models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Debe exportar una instancia de Sequelize

const db = {};

// Mantén la instancia y la clase
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// ===== Carga de modelos =====
db.User    = require('./user')(sequelize, DataTypes);
db.Product = require('./product')(sequelize, DataTypes);

// ===== Asociaciones (si luego las agregas) =====
// p.ej. db.Product.hasMany(db.ProductRating, { foreignKey: 'product_id' });

// Opcional: helper para sincronizar según entorno
db.init = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a DB OK');
    // OJO: NUNCA uses force:true en prod.
    // await sequelize.sync({ alter: true });
  } catch (err) {
    console.error('Error conectando DB:', err);
    throw err;
  }
};

module.exports = db;
