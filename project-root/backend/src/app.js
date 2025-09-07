const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Configuração do CORS para aceitar requisições do frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Rota de teste
app.get('/api/ping', (req, res) => res.json({ ok: true }));

async function syncDB() {
  await sequelize.authenticate();
  await User.sync();
  await Product.sync();
}

module.exports = { app, syncDB };
