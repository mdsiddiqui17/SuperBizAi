const WorkspaceLink = require('../models/WorkspaceLink');

// Basic URL validation function (supplements schema regex for controller-level check if needed)
const isValidUrl = (urlString) => {
  try {
    new URL(urlString); // Standard URL constructor will throw if invalid
    // More robust regex if needed, but schema one is primary for DB.
    // const urlPattern = new RegExp('^(https?:\/\/)?'+ // protocol
    // '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
    // '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
    // '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
    // '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
    // '(\#[-a-z\d_]*)?$','i'); // fragment locator
    // return !!urlPattern.test(urlString);
    return true; // Assuming schema validation is primary for now
  } catch (e) {
    return false;
  }
};

// @desc    Create a new workspace link
// @route   POST /api/productive-space/links
// @access  Private
exports.createWorkspaceLink = async (req, res) => {
  try {
    const { name, url, category, icon } = req.body;

    if (!name || !url) {
      return res.status(400).json({ message: 'Name and URL are required for the workspace link.' });
    }

    // Controller-level URL validation (optional, as schema also validates)
    // if (!isValidUrl(url)) {
    //   return res.status(400).json({ message: 'Please provide a valid URL.' });
    // }

    const link = new WorkspaceLink({
      name,
      url,
      category, // Will use default from schema if not provided
      icon,
      userId: req.user.userId,
    });

    const createdLink = await link.save();
    res.status(201).json(createdLink);
  } catch (error) {
    console.error('Error creating workspace link:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error while creating workspace link.' });
  }
};

// @desc    Get all workspace links for the logged-in user
// @route   GET /api/productive-space/links
// @access  Private
exports.getUserWorkspaceLinks = async (req, res) => {
  try {
    const query = { userId: req.user.userId };
    const { category, sortBy } = req.query;

    if (category) {
      query.category = category;
    }

    let sortOptions = {};
    if (sortBy) {
        const parts = sortBy.split(':');
        sortOptions[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
        sortOptions.name = 1; // Default sort by name ascending
    }

    const links = await WorkspaceLink.find(query).sort(sortOptions);
    res.status(200).json(links);
  } catch (error) {
    console.error('Error fetching user workspace links:', error);
    res.status(500).json({ message: 'Server error while fetching workspace links.' });
  }
};

// @desc    Get a single workspace link by ID
// @route   GET /api/productive-space/links/:id
// @access  Private
exports.getWorkspaceLinkById = async (req, res) => {
  try {
    const link = await WorkspaceLink.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ message: 'Workspace link not found.' });
    }

    if (link.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to access this link.' });
    }

    res.status(200).json(link);
  } catch (error) {
    console.error('Error fetching workspace link by ID:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Link not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while fetching link.' });
  }
};

// @desc    Update a workspace link
// @route   PUT /api/productive-space/links/:id
// @access  Private
exports.updateWorkspaceLink = async (req, res) => {
  try {
    let link = await WorkspaceLink.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ message: 'Workspace link not found.' });
    }

    if (link.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to update this link.' });
    }

    const { name, url, category, icon } = req.body;

    // if (url && !isValidUrl(url)) { // Optional controller-level validation
    //   return res.status(400).json({ message: 'Please provide a valid URL for update.' });
    // }

    if (name !== undefined) link.name = name;
    if (url !== undefined) link.url = url;
    if (category !== undefined) link.category = category;
    if (icon !== undefined) link.icon = icon;

    const updatedLink = await link.save();
    res.status(200).json(updatedLink);
  } catch (error) {
    console.error('Error updating workspace link:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Link not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while updating link.' });
  }
};

// @desc    Delete a workspace link
// @route   DELETE /api/productive-space/links/:id
// @access  Private
exports.deleteWorkspaceLink = async (req, res) => {
  try {
    const link = await WorkspaceLink.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ message: 'Workspace link not found.' });
    }

    if (link.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to delete this link.' });
    }

    await link.remove();
    res.status(200).json({ message: 'Workspace link removed successfully.' });
  } catch (error) {
    console.error('Error deleting workspace link:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Link not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while deleting link.' });
  }
};
