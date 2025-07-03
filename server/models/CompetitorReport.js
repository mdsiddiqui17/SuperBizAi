// server/models/CompetitorReport.js
const mongoose = require('mongoose');

const CompetitorReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  competitors: [
    {
      name: String,
      website: String,
      notes: String
    }
  ],
  aiSummary: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('CompetitorReport', CompetitorReportSchema);
