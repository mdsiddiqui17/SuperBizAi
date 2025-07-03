const express = require('express');
const router = express.Router();
const { generateImage } = require('../controllers/imageController');
const { verifyToken } = require('../middleware/authMiddleware'); // ✅ Correct import

router.post('/generate-image', verifyToken, generateImage); // ✅ Now works as a middleware

module.exports = router;
