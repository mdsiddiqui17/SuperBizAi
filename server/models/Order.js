const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  name: String,
  email: String,
  phone: String,
  products: [{
    name: String,
    unitPrice: Number,
    quantity: Number
  }],
  total: Number,
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Order', OrderSchema);