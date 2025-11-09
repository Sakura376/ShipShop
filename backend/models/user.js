module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id:     { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
    name:        { type: DataTypes.STRING(50), field: 'username', allowNull: false }, // ← mapea username→name
    email:       { type: DataTypes.STRING(254), allowNull: false },
    password_hash: DataTypes.STRING(255),
    password_algo:{ type: DataTypes.ENUM('argon2id','bcrypt','scrypt'), defaultValue: 'argon2id' },
    status:      { type: DataTypes.ENUM('active','pending','suspended','deleted'), defaultValue: 'pending' },
    email_verified_at: DataTypes.DATE,
    last_login_at:     DataTypes.DATE,
    failed_login_attempts: DataTypes.TINYINT.UNSIGNED,
    locked_until: DataTypes.DATE,
    created_at:  DataTypes.DATE,
    updated_at:  DataTypes.DATE,
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true
  });
  return User;
};
