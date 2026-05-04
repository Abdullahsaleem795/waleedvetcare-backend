const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  customer: {
    name:       String,
    email:      String,
    phone:      String,
    address:    String,
    city:       String,
    postalCode: String,
  },
  items: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:     String,
    price:    Number,
    quantity: Number,
  }],
  subtotal:        { type: Number, required: true },
  deliveryCharges: { type: Number, default: 150 },
  totalAmount:     { type: Number, required: true },
  paymentMethod:   { type: String, enum: ['cod', 'bank', 'easypaisa', 'jazzcash'] },
  status:          { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
}, { timestamps: true });

orderSchema.pre('save', async function() {
  if (!this.invoiceNumber) {
    this.invoiceNumber = 'WVC-' + Date.now();
  }
});

module.exports = mongoose.model('Order', orderSchema);