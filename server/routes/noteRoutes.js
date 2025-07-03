const express = require('express');
const router = express.Router();
const {
  createNote,
  getUserNotes,
  getNoteById,
  updateNote,
  deleteNote
} = require('../controllers/noteController');

const { verifyToken } = require('../middleware/authMiddleware'); // ✅ Corrected import

// Protect all routes in this router with verifyToken middleware
router.use(verifyToken); // ✅ Now this works

// CRUD routes for notes
router.route('/')
  .post(createNote)
  .get(getUserNotes);

router.route('/:id')
  .get(getNoteById)
  .put(updateNote)
  .delete(deleteNote);

module.exports = router;
