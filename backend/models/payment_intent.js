module.exports = (sequelize, DataTypes) => {
  return sequelize.define('payment_intents', {
    id:               { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    order_id:         { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    amount:           { type: DataTypes.DECIMAL(12,2), allowNull: false, get(){ return Number(this.getDataValue('amount')); } },
    currency:         { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'USD' },
    status:           { type: DataTypes.ENUM('requires_payment','processing','succeeded','failed','cancelled'), allowNull:false, defaultValue:'requires_payment' },
    idempotency_key:  { type: DataTypes.STRING(80), allowNull: false },
    provider_ref:     { type: DataTypes.STRING(80), allowNull: true },
    error_message:    { type: DataTypes.STRING(255), allowNull: true },
    created_at:       { type: DataTypes.DATE, allowNull:false, defaultValue: DataTypes.NOW },
    updated_at:       { type: DataTypes.DATE, allowNull:false, defaultValue: DataTypes.NOW }
  }, { tableName: 'payment_intents', timestamps: false, indexes: [{ unique:true, fields:['idempotency_key'] }, { fields:['order_id'] }] });
};
