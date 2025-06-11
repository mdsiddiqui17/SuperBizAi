const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contentText: { type: String, required: true },
  imageUrl: { type: String },
  type: { type: String, enum: ['generated', 'custom'], required: true },
  platform: { type: String },
  scheduledFor: { type: Date },
  status: { type: String, enum: ['draft', 'scheduled', 'posted'], default: 'draft' },
}, { timestamps: true });

module.exports = mongoose.model('Ad', adSchema);
