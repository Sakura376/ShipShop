// backend/models/pending_user.js

module.exports = (sequelize, DataTypes) => {
  const PendingUser = sequelize.define(
    "pending_users",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      email: {
        type: DataTypes.STRING(254),
        allowNull: false,
        unique: true,
      },

      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      // 👇 ESTE nombre debe coincidir con la columna real de tu tabla
      password_algo: {
        type: DataTypes.ENUM("argon2id", "bcrypt", "scrypt"),
        allowNull: false,
        defaultValue: "argon2id",
      },

      code_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      attempts: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      used_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "pending_users",
      timestamps: false,
    }
  );

  return PendingUser;
};
