const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware'); // ✅ Corrected
const {
  generateAd,
  saveCustomAd,
  listAds,
  scheduleAd
} = require('../controllers/adController');

router.post('/generate', verifyToken, generateAd);
router.post('/save', verifyToken, saveCustomAd);
router.get('/list', verifyToken, listAds);
router.post('/schedule', verifyToken, scheduleAd);

module.exports = router;
