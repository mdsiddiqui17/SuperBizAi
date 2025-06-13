const express = require('express');
const router = express.Router();
const {
  createReminder,
  getUserReminders,
  getReminderById,
  updateReminder,
  deleteReminder
} = require('../controllers/reminderController'); // Adjust path if controller is elsewhere
const authMiddleware = require('../middleware/authMiddleware'); // Adjust path to your authMiddleware

// All routes in this file will be protected by authMiddleware
router.use(authMiddleware);

// Define CRUD routes for reminders
router.route('/')
  .post(createReminder)
  .get(getUserReminders);

router.route('/:id')
  .get(getReminderById)
  .put(updateReminder)
  .delete(deleteReminder);

module.exports = router;
