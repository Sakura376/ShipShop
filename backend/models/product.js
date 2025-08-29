// backend/models/product.js

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    product_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    sku:         { type: DataTypes.STRING(40), allowNull: false, unique: true },
    title:       { type: DataTypes.STRING(120), allowNull: false },
    tipo_nave:   { type: DataTypes.STRING(60) },
    description: { type: DataTypes.TEXT },
    description_info: { type: DataTypes.TEXT },
    caracteristics:   { type: DataTypes.TEXT },
    image_product:    { type: DataTypes.STRING(512) },
    image_info:       { type: DataTypes.STRING(512) },
    price:       { type: DataTypes.DECIMAL(12,2), allowNull: false },
    quantity:    { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
    is_active:   { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Product;
};
