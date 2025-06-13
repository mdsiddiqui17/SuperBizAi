const express = require('express');
const router = express.Router();
const {
  createNote,
  getUserNotes,
  getNoteById,
  updateNote,
  deleteNote
} = require('../controllers/noteController'); // Adjust path if controller is elsewhere
const authMiddleware = require('../middleware/authMiddleware'); // Adjust path to your authMiddleware

// All routes in this file will be protected by authMiddleware
router.use(authMiddleware);

// Define CRUD routes for notes
router.route('/')
  .post(createNote)
  .get(getUserNotes);

router.route('/:id')
  .get(getNoteById)
  .put(updateNote)
  .delete(deleteNote);

module.exports = router;
