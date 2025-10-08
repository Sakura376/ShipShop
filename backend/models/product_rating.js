// backend/models/product_rating.js
module.exports = (sequelize, DataTypes) => {
  const ProductRating = sequelize.define('product_ratings', {
    rating_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    rating: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: { min: 1, max: 5 },
      get() { return Number(this.getDataValue('rating')); }
    },
    comment: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    rating_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'product_ratings',
    timestamps: false,
    indexes: [
      // En tu SQL ya hay UNIQUE (user_id, product_id); lo reflejamos también aquí.
      { unique: true, fields: ['user_id', 'product_id'] },
      { fields: ['product_id'] },
      { fields: ['user_id'] },
    ],
  });

  return ProductRating;
};
