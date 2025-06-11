
const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, description, tags } = req.body;

    const product = new Product({
      userId: req.user.userId,
      name,
      category,
      price,
      description,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      imageUrl: req.file ? `/uploads/${req.file.filename}` : ''
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('❌ Error creating product:', err.message);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('❌ Error fetching products:', err.message);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('❌ Error deleting product:', err.message);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};
