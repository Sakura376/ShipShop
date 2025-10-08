module.exports = (sequelize, DataTypes) => {
  return sequelize.define('order_details', {
    order_detail_id:{ type: DataTypes.BIGINT.UNSIGNED, primaryKey:true, autoIncrement:true },
    order_id:       { type: DataTypes.BIGINT.UNSIGNED, allowNull:false },
    product_id:     { type: DataTypes.BIGINT.UNSIGNED, allowNull:false },
    quantity:       { type: DataTypes.INTEGER.UNSIGNED, allowNull:false },
    unit_price:     { type: DataTypes.DECIMAL(12,2), allowNull:false,
                      get(){ return Number(this.getDataValue('unit_price')); } },
    created_at:     { type: DataTypes.DATE, allowNull:false, defaultValue: DataTypes.NOW }
  }, { tableName:'order_details', timestamps:false });
};
