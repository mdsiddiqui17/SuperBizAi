const express = require('express');
const router = express.Router();
const {
  createCRMContact,
  getUserCRMContacts,
  getCRMContactById,
  updateCRMContact,
  deleteCRMContact
} = require('../controllers/crmContactController');

const { verifyToken } = require('../middleware/authMiddleware'); // ✅ Corrected

// Apply verifyToken middleware to all routes
router.use(verifyToken);

// CRM Contact CRUD routes
router.route('/')
  .post(createCRMContact)
  .get(getUserCRMContacts);

router.route('/:id')
  .get(getCRMContactById)
  .put(updateCRMContact)
  .delete(deleteCRMContact);

module.exports = router;
