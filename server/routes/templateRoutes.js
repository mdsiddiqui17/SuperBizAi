const express = require('express');
const router = express.Router();
const {
  createTemplate,
  getUserTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate
} = require('../controllers/templateController');

const { verifyToken } = require('../middleware/authMiddleware'); // ✅ Corrected import

// Protect all template routes
router.use(verifyToken);

// Template CRUD routes
router.route('/')
  .post(createTemplate)
  .get(getUserTemplates);

router.route('/:id')
  .get(getTemplateById)
  .put(updateTemplate)
  .delete(deleteTemplate);

module.exports = router;
