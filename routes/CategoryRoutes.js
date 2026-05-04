const express   = require('express');
const router    = express.Router();
const Category  = require('../models/Category');
const { adminProtect } = require('../middleware/adminMiddleware');

// Sab active categories
router.get('/', async (req, res) => {
  const cats = await Category.find({ isActive: true }).sort('displayOrder');
  res.json(cats);
});

// Admin: category add karo
router.post('/', adminProtect, async (req, res) => {
  const { name, description, icon, displayOrder } = req.body;
  const exists = await Category.findOne({ name });
  if (exists) return res.status(400).json({ message: 'Category already exists' });
  const cat = await Category.create({ name, description, icon, displayOrder });
  res.status(201).json(cat);
});

// Admin: category update karo
router.put('/:id', adminProtect, async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  res.json(cat);
});

// Admin: category delete karo
router.delete('/:id', adminProtect, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category deleted' });
});

module.exports = router;