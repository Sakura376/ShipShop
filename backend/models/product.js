module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    product_id:     { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    sku:            { type: DataTypes.STRING(40), allowNull: false },
    title:          { type: DataTypes.STRING(120), allowNull: false },
    description:    { type: DataTypes.TEXT, field: 'description' },
    descriptionInfo:{ type: DataTypes.TEXT, field: 'description_info' },
    caracteristics: { type: DataTypes.TEXT, field: 'caracteristics' },
    imageUrl:       { type: DataTypes.STRING(512), field: 'image_product' },
    imageInfo:      { type: DataTypes.STRING(512), field: 'image_info' },
    tipoNave:       { type: DataTypes.STRING(60),  field: 'tipo_nave' },
    price:          { type: DataTypes.DECIMAL(12,2), allowNull: false },
    quantity:       { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
    active:         { type: DataTypes.TINYINT, field: 'is_active', defaultValue: 1 },
    created_at:     DataTypes.DATE,
    updated_at:     DataTypes.DATE,
  }, {
    tableName: 'products',
    underscored: true,
    timestamps: true
  });
  return Product;
};
