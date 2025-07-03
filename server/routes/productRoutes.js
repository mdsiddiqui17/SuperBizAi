const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware'); // ✅ Fixed import
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
  createProduct,
  getProducts,
  deleteProduct
} = require('../controllers/productController');

router.post('/', verifyToken, upload.single('image'), createProduct);
router.get('/', verifyToken, getProducts);
router.delete('/:id', verifyToken, deleteProduct);

module.exports = router;
