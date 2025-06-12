// routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Import controller functions
const { register, login, googleLoginOrRegister } = require('../controllers/authController');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Google Sign-In/Registration route
router.post('/google', googleLoginOrRegister);

module.exports = router;
