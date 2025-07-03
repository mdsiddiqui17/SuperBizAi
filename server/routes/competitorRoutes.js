const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/authMiddleware');
const { createReport, getReports } = require('../controllers/competitorController');

router.post('/', verifyToken, createReport);
router.get('/', verifyToken, getReports);

module.exports = router;
