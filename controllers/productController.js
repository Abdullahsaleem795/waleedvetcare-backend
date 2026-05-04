const Product = require('../models/Product');

const getProducts    = async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const products = await Product.find(filter);
  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

const createProduct = async (req, res) => {
  const { name, category, price, description, benefits, usage, stock } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';
  const product = await Product.create({ name, category, price, description, benefits, usage, stock, image });
  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  Object.assign(product, req.body);
  if (req.file) product.image = `/uploads/${req.file.filename}`;
  await product.save();
  res.json(product);
};

const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };