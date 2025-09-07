const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define o modelo User
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'users', timestamps: true });

module.exports = User;
