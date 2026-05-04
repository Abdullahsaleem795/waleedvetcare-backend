const express    = require('express');
const router     = express.Router();
const Inventory  = require('../models/Inventory');
const Product    = require('../models/Product');
const { adminProtect } = require('../middleware/adminMiddleware');

// Stock movement record karo
router.post('/', adminProtect, async (req, res) => {
  const { product, type, quantity, note } = req.body;
  const record = await Inventory.create({ product, type, quantity, note });
  const inc = type === 'stock_in' ? quantity : -quantity;
  await Product.findByIdAndUpdate(product, { $inc: { stock: inc } });
  res.status(201).json(record);
});

// Sab inventory records lo
router.get('/', adminProtect, async (req, res) => {
  const records = await Inventory.find().populate('product', 'name stock').sort('-createdAt');
  res.json(records);
});

// Low stock products
router.get('/lowstock', adminProtect, async (req, res) => {
  const products = await Product.find({ stock: { $lte: 10 } });
  res.json(products);
});

module.exports = router;