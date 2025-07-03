const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware'); // ✅ Destructure correctly

router.get('/', verifyToken, (req, res) => {
  res.json({ message: `Welcome to your dashboard, user: ${req.user.userId}` });
});

module.exports = router;
