const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  competitors: [String],
  reviews: {
    positive: Number,
    negative: Number
  },
  socialMedia: {
    engagementRate: Number,
    platformStats: Object
  },
  productSales: {
    totalSold: Number,
    breakdown: Object
  },
  crmLeads: {
    total: Number,
    converted: Number
  },
  generatedReport: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
