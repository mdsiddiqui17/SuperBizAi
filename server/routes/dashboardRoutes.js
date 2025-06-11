const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

router.get('/', auth, (req, res) => {
  res.json({ message: `Welcome to your dashboard, user: ${req.user.userId}` });
});

module.exports = router;