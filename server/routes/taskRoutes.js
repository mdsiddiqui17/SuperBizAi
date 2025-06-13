const express = require('express');
const router = express.Router();
const {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/taskController'); // Adjust path if controller is elsewhere
const authMiddleware = require('../middleware/authMiddleware'); // Adjust path to your authMiddleware

// All routes in this file will be protected by authMiddleware
router.use(authMiddleware);

// Define CRUD routes
router.route('/')
  .post(createTask)
  .get(getUserTasks);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
