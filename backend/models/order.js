module.exports = (sequelize, DataTypes) => {
  return sequelize.define('orders', {
    order_id:   { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    user_id:    { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    total:      { type: DataTypes.DECIMAL(12,2), allowNull: false,
                  get(){ return Number(this.getDataValue('total')); } },
    status:     { type: DataTypes.ENUM('created','paid','shipped','cancelled','refunded'), allowNull:false, defaultValue:'created' },
    order_date: { type: DataTypes.DATE, allowNull:false, defaultValue: DataTypes.NOW },
    created_at: { type: DataTypes.DATE, allowNull:false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull:false, defaultValue: DataTypes.NOW }
  }, { tableName:'orders', timestamps:false });
};
