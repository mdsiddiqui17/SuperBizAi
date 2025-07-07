const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');

// GET all orders for logged-in user
router.get('/', verifyToken, getOrders);

// POST a new order
router.post('/', verifyToken, createOrder);

// PUT update order by ID
router.put('/:id', verifyToken, updateOrder);

// DELETE order by ID
router.delete('/:id', verifyToken, deleteOrder);

module.exports = router;
