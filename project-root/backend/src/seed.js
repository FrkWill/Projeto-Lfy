const sequelize = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const bcrypt = require('bcrypt');

require('dotenv').config();

//gera um usuário e alguns produtos
async function seed() {
  await sequelize.sync({ force: true });
  const passHash = await bcrypt.hash('123456', 10);
  await User.create({ username: 'admin', passwordHash: passHash });
  await Product.bulkCreate([
    { name: 'Camiseta Preta', sku: 'TSH-001', price: 59.90, stock: 25 },
    { name: 'Calça Jeans', sku: 'JEAN-002', price: 149.90, stock: 12 },
    { name: 'Tênis Runner', sku: 'SNE-003', price: 299.00, stock: 8 }
  ]);
  process.exit(0);
}

seed();
