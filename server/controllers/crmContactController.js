const CRMContact = require('../models/CRMContact');

// @desc    Create a new CRM contact
// @route   POST /api/productive-space/crm
// @access  Private
exports.createCRMContact = async (req, res) => {
  try {
    const { name, company, email, phone, notes, tags } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required for the CRM contact.' });
    }

    // Basic email validation if email is provided
    if (email) {
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address.' });
        }
    }

    const contact = new CRMContact({
      name,
      company,
      email,
      phone,
      notes,
      tags: tags || [],
      userId: req.user.userId,
    });

    const createdContact = await contact.save();
    res.status(201).json(createdContact);
  } catch (error) {
    console.error('Error creating CRM contact:', error);
    if (error.name === 'ValidationError') {
      // Mongoose validation errors (e.g., from regex match in schema)
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error while creating CRM contact.' });
  }
};

// @desc    Get all CRM contacts for the logged-in user
// @route   GET /api/productive-space/crm
// @access  Private
exports.getUserCRMContacts = async (req, res) => {
  try {
    const query = { userId: req.user.userId };
    const { tags, search, sortBy } = req.query;

    if (tags) {
      const tagsArray = tags.split(',').map(tag => tag.trim());
      if (tagsArray.length > 0) {
        query.tags = { $in: tagsArray };
      }
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive
      query.$or = [
        { name: searchRegex },
        { company: searchRegex },
        { email: searchRegex },
        // Note: Searching tags array with regex is more complex with $or,
        // $in for tags is usually better. If text search on tags is needed, consider specific logic.
      ];
    }

    let sortOptions = {};
    if (sortBy) {
        const parts = sortBy.split(':');
        sortOptions[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
        sortOptions.name = 1; // Default sort by name ascending
    }

    const contacts = await CRMContact.find(query).sort(sortOptions);
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching user CRM contacts:', error);
    res.status(500).json({ message: 'Server error while fetching CRM contacts.' });
  }
};

// @desc    Get a single CRM contact by ID
// @route   GET /api/productive-space/crm/:id
// @access  Private
exports.getCRMContactById = async (req, res) => {
  try {
    const contact = await CRMContact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'CRM Contact not found.' });
    }

    if (contact.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to access this contact.' });
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error('Error fetching CRM contact by ID:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Contact not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while fetching contact.' });
  }
};

// @desc    Update a CRM contact
// @route   PUT /api/productive-space/crm/:id
// @access  Private
exports.updateCRMContact = async (req, res) => {
  try {
    let contact = await CRMContact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'CRM Contact not found.' });
    }

    if (contact.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to update this contact.' });
    }

    const { name, company, email, phone, notes, tags } = req.body;

    // Basic email validation if email is being updated and is provided
    if (email !== undefined) {
        if (email === '' || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            contact.email = email; // Allow empty string or valid email
        } else {
            return res.status(400).json({ message: 'Please provide a valid email address for update.' });
        }
    }

    if (name !== undefined) contact.name = name;
    if (company !== undefined) contact.company = company;
    if (phone !== undefined) contact.phone = phone;
    if (notes !== undefined) contact.notes = notes;
    if (tags !== undefined) contact.tags = Array.isArray(tags) ? tags : [];

    const updatedContact = await contact.save();
    res.status(200).json(updatedContact);
  } catch (error) {
    console.error('Error updating CRM contact:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Contact not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while updating contact.' });
  }
};

// @desc    Delete a CRM contact
// @route   DELETE /api/productive-space/crm/:id
// @access  Private
exports.deleteCRMContact = async (req, res) => {
  try {
    const contact = await CRMContact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'CRM Contact not found.' });
    }

    if (contact.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to delete this contact.' });
    }

    await contact.remove();
    res.status(200).json({ message: 'CRM Contact removed successfully.' });
  } catch (error)
 {
    console.error('Error deleting CRM contact:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Contact not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while deleting contact.' });
  }
};
