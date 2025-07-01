const Analytics = require('../models/Analytics');

// Fetch analytics data for logged-in user
exports.getUserAnalytics = async (req, res) => {
  try {
    const data = await Analytics.find({ userId: req.user.userId });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: err.message });
  }
};

// Create a new analytics record
exports.createAnalytics = async (req, res) => {
  try {
    const analytics = new Analytics({ ...req.body, userId: req.user.userId });
    const saved = await analytics.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create analytics', error: err.message });
  }
};

// Generate a summarized report (simulated AI response for now)
exports.generateReport = async (req, res) => {
  try {
    // Placeholder for actual analysis logic or AI integration
    const summary = {
      summary: "Your product sales are growing steadily. Social engagement is high, though competitors are launching more frequently. Negative reviews rose slightly last month.",
      positives: [
        "Social engagement is above industry average",
        "CRM leads are converting well"
      ],
      negatives: [
        "Negative reviews increased 15%",
        "Competitors launched 3 new products this month"
      ]
    };

    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate report', error: err.message });
  }
};
