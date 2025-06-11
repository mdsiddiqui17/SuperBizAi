const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const { saveContentProfile, generateContent } = require('../controllers/contentController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post(
  '/setup',
  authMiddleware,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'guidelines', maxCount: 1 }
  ]),
  saveContentProfile
);

router.post(
  '/generate',
  authMiddleware,
  generateContent
);

module.exports = router;
