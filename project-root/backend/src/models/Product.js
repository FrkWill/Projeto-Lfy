const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Define o modelo Product
const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  sku: { type: DataTypes.STRING, allowNull: true },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: true },
  stock: { type: DataTypes.INTEGER, allowNull: true }
}, { tableName: 'products', timestamps: true });

module.exports = Product;
