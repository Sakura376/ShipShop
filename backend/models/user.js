const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('users', {
  user_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(254), allowNull: false },          // UNIQUE en SQL por email_norm
  password_hash: { type: DataTypes.STRING(255), allowNull: false },  // hash con argon2
  password_algo: { type: DataTypes.ENUM('argon2id','bcrypt','scrypt'), allowNull: false, defaultValue: 'argon2id' },
  status: { type: DataTypes.ENUM('active','pending','suspended','deleted'), allowNull: false, defaultValue: 'pending' },
  email_verified_at: { type: DataTypes.DATE, allowNull: true },
  last_login_at: { type: DataTypes.DATE, allowNull: true },
  failed_login_attempts: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0 },
  locked_until: { type: DataTypes.DATE, allowNull: true },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { timestamps: false });
