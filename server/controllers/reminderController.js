const Reminder = require('../models/Reminder');

// @desc    Create a new reminder
// @route   POST /api/productive-space/reminders
// @access  Private
exports.createReminder = async (req, res) => {
  try {
    const { message, remindAt, isRecurring, recurrenceRule, status } = req.body;

    if (!message || !remindAt) {
      return res.status(400).json({ message: 'Message and remindAt date are required for the reminder.' });
    }

    // Basic validation for remindAt
    if (isNaN(new Date(remindAt).getTime())) {
        return res.status(400).json({ message: 'Invalid remindAt date format.' });
    }

    const reminder = new Reminder({
      message,
      remindAt: new Date(remindAt),
      isRecurring: isRecurring || false,
      recurrenceRule: recurrenceRule || null,
      status: status || 'pending', // Default to pending if not provided
      userId: req.user.userId,
    });

    const createdReminder = await reminder.save();
    res.status(201).json(createdReminder);
  } catch (error) {
    console.error('Error creating reminder:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error while creating reminder.' });
  }
};

// @desc    Get all reminders for the logged-in user
// @route   GET /api/productive-space/reminders
// @access  Private
exports.getUserReminders = async (req, res) => {
  try {
    const query = { userId: req.user.userId };
    const { status, remindAfter, remindBefore, sortBy } = req.query;

    if (status) query.status = status;

    if (remindAfter) {
        if (isNaN(new Date(remindAfter).getTime())) return res.status(400).json({ message: 'Invalid remindAfter date format.' });
        query.remindAt = { ...query.remindAt, $gte: new Date(remindAfter) };
    }
    if (remindBefore) {
        if (isNaN(new Date(remindBefore).getTime())) return res.status(400).json({ message: 'Invalid remindBefore date format.' });
        query.remindAt = { ...query.remindAt, $lte: new Date(remindBefore) };
    }

    let sortOptions = {};
    if (sortBy) {
        const parts = sortBy.split(':');
        sortOptions[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
        sortOptions.remindAt = 1; // Default sort by soonest reminder first
    }

    const reminders = await Reminder.find(query).sort(sortOptions);
    res.status(200).json(reminders);
  } catch (error) {
    console.error('Error fetching user reminders:', error);
    res.status(500).json({ message: 'Server error while fetching reminders.' });
  }
};

// @desc    Get a single reminder by ID
// @route   GET /api/productive-space/reminders/:id
// @access  Private
exports.getReminderById = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found.' });
    }

    if (reminder.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to access this reminder.' });
    }

    res.status(200).json(reminder);
  } catch (error) {
    console.error('Error fetching reminder by ID:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Reminder not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while fetching reminder.' });
  }
};

// @desc    Update a reminder
// @route   PUT /api/productive-space/reminders/:id
// @access  Private
exports.updateReminder = async (req, res) => {
  try {
    let reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found.' });
    }

    if (reminder.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to update this reminder.' });
    }

    const { message, remindAt, isRecurring, recurrenceRule, status } = req.body;

    if (message !== undefined) reminder.message = message;
    if (remindAt !== undefined) {
        if (isNaN(new Date(remindAt).getTime())) return res.status(400).json({ message: 'Invalid remindAt date format for update.' });
        reminder.remindAt = new Date(remindAt);
    }
    if (isRecurring !== undefined) reminder.isRecurring = isRecurring;
    if (recurrenceRule !== undefined) reminder.recurrenceRule = recurrenceRule; // Allow setting to null/empty
    if (status !== undefined) reminder.status = status;

    const updatedReminder = await reminder.save();
    res.status(200).json(updatedReminder);
  } catch (error) {
    console.error('Error updating reminder:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Reminder not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while updating reminder.' });
  }
};

// @desc    Delete a reminder
// @route   DELETE /api/productive-space/reminders/:id
// @access  Private
exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found.' });
    }

    if (reminder.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to delete this reminder.' });
    }

    await reminder.remove();
    res.status(200).json({ message: 'Reminder removed successfully.' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Reminder not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while deleting reminder.' });
  }
};
