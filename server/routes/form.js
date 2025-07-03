const express = require('express');
const {
  createForm,
  getUserForms,
  deleteForm,
  getFormById,
  submitFormResponse,
  getFormResponses,
  getPublicForm
} = require('../controllers/formController');

const { verifyToken } = require('../middleware/authMiddleware'); // ✅ CommonJS import

const router = express.Router();

// Routes
router.post('/create', verifyToken, createForm);
router.get('/user', verifyToken, getUserForms);
router.delete('/:formId', verifyToken, deleteForm);
router.get('/:formId', getFormById);
router.get('/responses/:formId', verifyToken, getFormResponses);

// Public
router.get('/public/:formId', getPublicForm);
router.post('/submit/:formId', submitFormResponse);

module.exports = router;
