const User  = require('../models/User');
const Admin = require('../models/Admin');
const jwt   = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// User Register
const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });
  const user = await User.create({ name, email, password, phone });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
};

// User Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await user.matchPassword(password)) {
    res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (admin && await admin.matchPassword(password)) {
    res.json({ _id: admin._id, name: admin.name, email: admin.email, token: generateToken(admin._id), isAdmin: true });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
};

// Admin Account Create karne ka ek baar ka route (seed karne ke liye)
const createAdmin = async (req, res) => {
  const { name, email, password, secret } = req.body;
  if (secret !== process.env.ADMIN_SECRET)
    return res.status(403).json({ message: 'Wrong secret key' });
  const exists = await Admin.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Admin already exists' });
  const admin = await Admin.create({ name, email, password });
  res.status(201).json({ message: 'Admin created', name: admin.name });
};

module.exports = { registerUser, loginUser, loginAdmin, createAdmin };