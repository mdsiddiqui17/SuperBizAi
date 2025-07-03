const express = require('express');
const router = express.Router();
const {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const { verifyToken } = require('../middleware/authMiddleware'); // ✅ Correct import

// Protect all task routes
router.use(verifyToken);

// Task CRUD routes
router.route('/')
  .post(createTask)
  .get(getUserTasks);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
