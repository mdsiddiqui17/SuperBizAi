const mongoose = require('mongoose');

const ContentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: String,
  services: String,
  brandColors: [String]
});

module.exports = mongoose.model('ContentProfile', ContentProfileSchema);
