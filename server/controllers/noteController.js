const Note = require('../models/Note');

// @desc    Create a new note
// @route   POST /api/productive-space/notes
// @access  Private
exports.createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required for the note.' });
    }

    const note = new Note({
      title,
      content,
      tags: tags || [], // Ensure tags is an array, default to empty if not provided
      userId: req.user.userId, // Assuming authMiddleware sets req.user.userId
    });

    const createdNote = await note.save();
    res.status(201).json(createdNote);
  } catch (error) {
    console.error('Error creating note:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error while creating note.' });
  }
};

// @desc    Get all notes for the logged-in user
// @route   GET /api/productive-space/notes
// @access  Private
exports.getUserNotes = async (req, res) => {
  try {
    const query = { userId: req.user.userId };
    const { tags, search, sortBy } = req.query;

    if (tags) {
      // Assuming tags is a comma-separated string from query params
      const tagsArray = tags.split(',').map(tag => tag.trim());
      if (tagsArray.length > 0) {
        query.tags = { $in: tagsArray }; // Find notes containing any of the provided tags
      }
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
      query.$or = [
        { title: searchRegex },
        { content: searchRegex }
      ];
    }

    let sortOptions = {};
    if (sortBy) {
        const parts = sortBy.split(':');
        sortOptions[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
        sortOptions.updatedAt = -1; // Default sort by newest updated
    }

    const notes = await Note.find(query).sort(sortOptions);
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching user notes:', error);
    res.status(500).json({ message: 'Server error while fetching notes.' });
  }
};

// @desc    Get a single note by ID
// @route   GET /api/productive-space/notes/:id
// @access  Private
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    if (note.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to access this note.' });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error('Error fetching note by ID:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Note not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while fetching note.' });
  }
};

// @desc    Update a note
// @route   PUT /api/productive-space/notes/:id
// @access  Private
exports.updateNote = async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    if (note.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to update this note.' });
    }

    const { title, content, tags } = req.body;
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = Array.isArray(tags) ? tags : []; // Ensure tags is an array

    const updatedNote = await note.save();
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
     if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Note not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while updating note.' });
  }
};

// @desc    Delete a note
// @route   DELETE /api/productive-space/notes/:id
// @access  Private
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    if (note.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to delete this note.' });
    }

    await note.remove();
    res.status(200).json({ message: 'Note removed successfully.' });
  } catch (error) {
    console.error('Error deleting note:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Note not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while deleting note.' });
  }
};
