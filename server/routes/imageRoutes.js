const express = require('express');
const router = express.Router();
const { generateImage } = require('../controllers/imageController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/generate-image', authMiddleware, generateImage);

module.exports = router;
