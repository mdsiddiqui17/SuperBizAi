const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware'); // ✅ Correct import
const {
  getUserAnalytics,
  createAnalytics,
  generateReport
} = require('../controllers/analyticsController'); // ✅ Added missing import

// Protect all analytics routes
router.use(verifyToken);

// Routes
router.get('/', getUserAnalytics);
router.post('/', createAnalytics);
router.get('/report', generateReport);

module.exports = router;
