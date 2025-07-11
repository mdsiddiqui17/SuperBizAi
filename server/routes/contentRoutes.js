const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyToken } = require('../middleware/authMiddleware');

const {
  generateContent,
  generateMarketingPlan,
  generateStrategy,
  saveContentProfile,
  getContentProfile
} = require('../controllers/contentController');

// Setup Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Routes
router.post('/generate', verifyToken, generateContent);
router.post('/marketing-plan', verifyToken, generateMarketingPlan);
router.post('/strategy', verifyToken, generateStrategy);
router.post(
  '/setup',
  verifyToken,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'guidelines', maxCount: 1 }
  ]),
  saveContentProfile
);
router.get('/profile', verifyToken, getContentProfile);

module.exports = router;
