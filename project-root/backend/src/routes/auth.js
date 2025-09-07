const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const COOKIE_NAME = process.env.COOKIE_NAME || 'token';
const JWT_SECRET = process.env.JWT_SECRET;

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Missing credentials' });

  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(401).json({ message: 'Login Inválido!' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: 'Login Inválido!' });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.cookie(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logged in', user: { id: user.id, username: user.username } });
});

// Cadastro
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: 'Usuário e senha obrigatórios' });

    const existing = await User.findOne({ where: { username } });
    if (existing)
      return res.status(400).json({ message: 'Usuário já existe' });

    const hashed = await bcrypt.hash(password, 10);

    await User.create({ username, passwordHash: hashed });

    return res.json({ message: 'Usuário cadastrado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno ao cadastrar usuário' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ message: 'Logged out' });
});

module.exports = router;
