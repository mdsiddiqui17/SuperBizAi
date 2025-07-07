const Order = require('../models/Order');

// ✅ CREATE a new order
exports.createOrder = async (req, res) => {
  try {
    const { name, email, phone, orderNumber, products } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized. No user context.' });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Products are required.' });
    }

    const total = products.reduce((acc, p) => acc + p.unitPrice * p.quantity, 0);

    const newOrder = new Order({
      name,
      email,
      phone,
      orderNumber,
      products,
      total,
      user: req.user.userId,
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error });
  }
};

// ✅ GET all orders for a logged-in user
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// ✅ UPDATE an order by ID
exports.updateOrder = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const orderId = req.params.id;

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, user: userId },
      req.body,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('❌ Error updating order:', error);
    res.status(500).json({ message: 'Error updating order', error });
  }
};

// ✅ DELETE an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const orderId = req.params.id;

    const deletedOrder = await Order.findOneAndDelete({
      _id: orderId,
      user: userId,
    });

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting order:', error);
    res.status(500).json({ message: 'Error deleting order', error });
  }
};
