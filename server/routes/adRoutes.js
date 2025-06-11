const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { generateAd, saveCustomAd, listAds, scheduleAd } = require('../controllers/adController');

router.post('/generate', authMiddleware, generateAd);
router.post('/save', authMiddleware, saveCustomAd);
router.get('/list', authMiddleware, listAds);
router.post('/schedule', authMiddleware, scheduleAd);

module.exports = router;
