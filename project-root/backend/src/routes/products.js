const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

//rota de listagem e atualização de produtos
router.get('/', auth, async (req, res) => {
  const products = await Product.findAll({ order: [['id','ASC']] });
  res.json(products);
});

// Atualiza produto
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const product = await Product.findByPk(id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  await product.update(updates);
  res.json(product);
});

module.exports = router;
