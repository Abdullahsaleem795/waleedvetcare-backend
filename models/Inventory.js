const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type:      { type: String, enum: ['stock_in', 'stock_out'], required: true },
  quantity:  { type: Number, required: true },
  note:      { type: String },
  date:      { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);