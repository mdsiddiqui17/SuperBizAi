const express = require('express');
const Lead = require('../models/Lead');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all leads for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const leads = await Lead.find({ userId: req.user.userId });
    res.json(leads);
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new lead
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newLead = new Lead({ ...req.body, userId: req.user.userId }); // ✅ fix here
    await newLead.save();
    res.status(201).json(newLead);
  } catch (err) {
    console.error('Error creating lead:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a lead by ID
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedLead = await Lead.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId }, // ✅ fix here
      req.body,
      { new: true }
    );
    if (!updatedLead) return res.status(404).json({ message: 'Lead not found' });
    res.json(updatedLead);
  } catch (err) {
    console.error('Error updating lead:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a lead by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedLead = await Lead.findOneAndDelete({ _id: req.params.id, userId: req.user.userId }); // ✅ fix here
    if (!deletedLead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    console.error('Error deleting lead:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
