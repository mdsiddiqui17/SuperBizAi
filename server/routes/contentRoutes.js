const express = require('express');
const multer = require('multer');
const { verifyToken } = require('../middleware/authMiddleware'); // ✅ FIXED
const { saveContentProfile, generateContent } = require('../controllers/contentController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post(
  '/setup',
  verifyToken,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'guidelines', maxCount: 1 }
  ]),
  saveContentProfile
);

router.post(
  '/generate',
  verifyToken,
  generateContent
);

module.exports = router;
