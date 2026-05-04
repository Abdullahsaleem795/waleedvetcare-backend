const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String, required: true, enum: ['medicine', 'vaccine', 'supplement', 'care'] },
  price:       { type: Number, required: true },
  description: { type: String, required: true },
  benefits:    { type: String },
  usage:       { type: String },
  image:       { type: String, default: '' },
  stock:       { type: Number, required: true, default: 0 },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);