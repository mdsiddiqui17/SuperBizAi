const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getUserAnalytics, createAnalytics } = require('../controllers/analyticsController');

router.use(authMiddleware);

router.get('/', getUserAnalytics);
router.post('/', createAnalytics);

module.exports = router;
