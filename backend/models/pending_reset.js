module.exports = (sequelize, DataTypes) => {
  return sequelize.define('pending_resets', {
    id:          { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    email:       { type: DataTypes.STRING(254), allowNull: false },
    code_hash:   { type: DataTypes.STRING(255), allowNull: false },
    attempts:    { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0 },
    expires_at:  { type: DataTypes.DATE, allowNull: false },
    used_at:     { type: DataTypes.DATE, allowNull: true },
    created_at:  { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, { tableName: 'pending_resets', timestamps: false, indexes: [{ unique:true, fields:['email'] }] });
};
