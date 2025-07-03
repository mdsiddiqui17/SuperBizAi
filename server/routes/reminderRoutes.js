const express = require('express');
const router = express.Router();
const {
  createReminder,
  getUserReminders,
  getReminderById,
  updateReminder,
  deleteReminder
} = require('../controllers/reminderController');

const { verifyToken } = require('../middleware/authMiddleware'); // ✅ Destructure properly

// Apply verifyToken middleware to all routes
router.use(verifyToken);

// Reminder CRUD routes
router.route('/')
  .post(createReminder)
  .get(getUserReminders);

router.route('/:id')
  .get(getReminderById)
  .put(updateReminder)
  .delete(deleteReminder);

module.exports = router;
