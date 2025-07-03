const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware'); // ✅ Fix: get the function
const router = express.Router();

router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Welcome, user ID: ${req.user.userId}` });
});

module.exports = router;
