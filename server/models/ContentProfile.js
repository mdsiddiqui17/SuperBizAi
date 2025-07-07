const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number
});

const ContentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: String,
  services: String,
  brandColors: [String],
  brandNotes: String,
  logo: String,
  guidelines: String,
  products: [ProductSchema]
});

module.exports = mongoose.model('ContentProfile', ContentProfileSchema);
