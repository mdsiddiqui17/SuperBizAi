const Template = require('../models/Template');

// @desc    Create a new template
// @route   POST /api/productive-space/templates
// @access  Private
exports.createTemplate = async (req, res) => {
  try {
    const { title, type, structure } = req.body;

    if (!title || !type || !structure) {
      return res.status(400).json({ message: 'Title, type, and structure are required for the template.' });
    }

    // Optional: Add more specific validation for 'type' if enum isn't enough,
    // or for 'structure' based on 'type' (e.g., if type is 'task', structure might need certain fields)
    // For now, relying on schema enum for type and Mixed type for structure.

    const template = new Template({
      title,
      type,
      structure,
      userId: req.user.userId,
    });

    const createdTemplate = await template.save();
    res.status(201).json(createdTemplate);
  } catch (error) {
    console.error('Error creating template:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error while creating template.' });
  }
};

// @desc    Get all templates for the logged-in user
// @route   GET /api/productive-space/templates
// @access  Private
exports.getUserTemplates = async (req, res) => {
  try {
    const query = { userId: req.user.userId };
    const { type, sortBy } = req.query; // Filter by type

    if (type) {
      query.type = type;
    }

    let sortOptions = {};
    if (sortBy) {
        const parts = sortBy.split(':');
        sortOptions[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
        sortOptions.title = 1; // Default sort by title ascending
    }

    const templates = await Template.find(query).sort(sortOptions);
    res.status(200).json(templates);
  } catch (error) {
    console.error('Error fetching user templates:', error);
    res.status(500).json({ message: 'Server error while fetching templates.' });
  }
};

// @desc    Get a single template by ID
// @route   GET /api/productive-space/templates/:id
// @access  Private
exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ message: 'Template not found.' });
    }

    if (template.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to access this template.' });
    }

    res.status(200).json(template);
  } catch (error) {
    console.error('Error fetching template by ID:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Template not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while fetching template.' });
  }
};

// @desc    Update a template
// @route   PUT /api/productive-space/templates/:id
// @access  Private
exports.updateTemplate = async (req, res) => {
  try {
    let template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ message: 'Template not found.' });
    }

    if (template.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to update this template.' });
    }

    const { title, type, structure } = req.body;

    if (title !== undefined) template.title = title;
    if (type !== undefined) template.type = type;
    if (structure !== undefined) template.structure = structure; // Allow updating structure

    const updatedTemplate = await template.save();
    res.status(200).json(updatedTemplate);
  } catch (error) {
    console.error('Error updating template:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Template not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while updating template.' });
  }
};

// @desc    Delete a template
// @route   DELETE /api/productive-space/templates/:id
// @access  Private
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ message: 'Template not found.' });
    }

    if (template.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to delete this template.' });
    }

    await template.remove();
    res.status(200).json({ message: 'Template removed successfully.' });
  } catch (error) {
    console.error('Error deleting template:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Template not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while deleting template.' });
  }
};
