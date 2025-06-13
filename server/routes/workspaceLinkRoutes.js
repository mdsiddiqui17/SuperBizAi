const express = require('express');
const router = express.Router();
const {
  createWorkspaceLink,
  getUserWorkspaceLinks,
  getWorkspaceLinkById,
  updateWorkspaceLink,
  deleteWorkspaceLink
} = require('../controllers/workspaceLinkController'); // Adjust path if controller is elsewhere
const authMiddleware = require('../middleware/authMiddleware'); // Adjust path to your authMiddleware

// All routes in this file will be protected by authMiddleware
router.use(authMiddleware);

// Define CRUD routes for workspace links
router.route('/')
  .post(createWorkspaceLink)
  .get(getUserWorkspaceLinks);

router.route('/:id')
  .get(getWorkspaceLinkById)
  .put(updateWorkspaceLink)
  .delete(deleteWorkspaceLink);

module.exports = router;
