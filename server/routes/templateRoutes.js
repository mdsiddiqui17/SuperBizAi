const express = require('express');
const router = express.Router();
const {
  createTemplate,
  getUserTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate
} = require('../controllers/templateController'); // Adjust path if controller is elsewhere
const authMiddleware = require('../middleware/authMiddleware'); // Adjust path to your authMiddleware

// All routes in this file will be protected by authMiddleware
router.use(authMiddleware);

// Define CRUD routes for templates
router.route('/')
  .post(createTemplate)
  .get(getUserTemplates);

router.route('/:id')
  .get(getTemplateById)
  .put(updateTemplate)
  .delete(deleteTemplate);

module.exports = router;
