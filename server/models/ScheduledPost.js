const mongoose = require('mongoose');

const ScheduledPostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contentType: { type: String, enum: ['Post', 'Image', 'Ad', 'Video'], required: true },
  contentText: { type: String },
  mediaUrl: { type: String },
  scheduledTime: { type: Date, required: true },
  status: { type: String, default: 'Scheduled' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScheduledPost', ScheduledPostSchema);
