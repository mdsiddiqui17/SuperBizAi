const express = require('express');
const router = express.Router();
const {
  createWorkspaceLink,
  getUserWorkspaceLinks,
  getWorkspaceLinkById,
  updateWorkspaceLink,
  deleteWorkspaceLink
} = require('../controllers/workspaceLinkController');

const { verifyToken } = require('../middleware/authMiddleware'); // ✅ Fixed import

// Apply auth middleware to all routes
router.use(verifyToken);

// Workspace Link CRUD routes
router.route('/')
  .post(createWorkspaceLink)
  .get(getUserWorkspaceLinks);

router.route('/:id')
  .get(getWorkspaceLinkById)
  .put(updateWorkspaceLink)
  .delete(deleteWorkspaceLink);

module.exports = router;
