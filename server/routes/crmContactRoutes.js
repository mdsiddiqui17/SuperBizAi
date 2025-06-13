const express = require('express');
const router = express.Router();
const {
  createCRMContact,
  getUserCRMContacts,
  getCRMContactById,
  updateCRMContact,
  deleteCRMContact
} = require('../controllers/crmContactController'); // Adjust path if controller is elsewhere
const authMiddleware = require('../middleware/authMiddleware'); // Adjust path to your authMiddleware

// All routes in this file will be protected by authMiddleware
router.use(authMiddleware);

// Define CRUD routes for CRM contacts
router.route('/')
  .post(createCRMContact)
  .get(getUserCRMContacts);

router.route('/:id')
  .get(getCRMContactById)
  .put(updateCRMContact)
  .delete(deleteCRMContact);

module.exports = router;
