// server/controllers/competitorController.js
const CompetitorReport = require('../models/CompetitorReport');
const generateAIReport = require('../utils/generateAIReport'); // optional logic

// POST /api/competitor/analyze
exports.createReport = async (req, res) => {
  const { competitors } = req.body;
  const userId = req.user.id;

  try {
    const aiSummary = await generateAIReport(competitors); // simulate or mock this function

    const report = await CompetitorReport.create({
      user: userId,
      competitors,
      aiSummary
    });

    res.status(201).json(report);
  } catch (err) {
    console.error('❌ Failed to generate competitor report:', err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

// GET /api/competitor/reports
exports.getReports = async (req, res) => {
  const userId = req.user.id;

  try {
    const reports = await CompetitorReport.find({ user: userId }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};
