
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
  createProduct,
  getProducts,
  deleteProduct
} = require('../controllers/productController');

router.post('/', authMiddleware, upload.single('image'), createProduct);
router.get('/', authMiddleware, getProducts);
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
