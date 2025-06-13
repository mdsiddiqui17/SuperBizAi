const Task = require('../models/Task');

// @desc    Create a new task
// @route   POST /api/productive-space/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required for the task.' });
    }

    const task = new Task({
      title,
      description,
      status, // Will use default if not provided and schema has one
      dueDate, // Will use default if not provided and schema has one
      priority, // Will use default if not provided and schema has one
      userId: req.user.userId, // Assuming authMiddleware sets req.user.userId
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    console.error('Error creating task:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error while creating task.' });
  }
};

// @desc    Get all tasks for the logged-in user
// @route   GET /api/productive-space/tasks
// @access  Private
exports.getUserTasks = async (req, res) => {
  try {
    const query = { userId: req.user.userId };
    const { status, priority, dueDate, sortBy } = req.query; // sortBy e.g., 'dueDate:asc' or 'priority:desc'

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (dueDate) {
      // Assuming dueDate is a specific day. For ranges, more complex logic is needed.
      const startOfDay = new Date(dueDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dueDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.dueDate = { $gte: startOfDay, $lte: endOfDay };
    }

    let sortOptions = {};
    if (sortBy) {
        const parts = sortBy.split(':');
        sortOptions[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
        sortOptions.createdAt = -1; // Default sort by newest created
    }

    const tasks = await Task.find(query).sort(sortOptions);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ message: 'Server error while fetching tasks.' });
  }
};

// @desc    Get a single task by ID
// @route   GET /api/productive-space/tasks/:id
// @access  Private
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Ensure the task belongs to the logged-in user
    if (task.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to access this task.' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Task not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while fetching task.' });
  }
};

// @desc    Update a task
// @route   PUT /api/productive-space/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (task.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to update this task.' });
    }

    // Update fields provided in req.body
    const { title, description, status, dueDate, priority } = req.body;
    if (title !== undefined) task.title = title; // Allow empty string for title if intended
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null; // Handle clearing date
    if (priority !== undefined) task.priority = priority;

    // Mongoose validation will run on save.
    // Explicitly run validators for findByIdAndUpdate style updates if not using .save()
    const updatedTask = await task.save();
    // Or: const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    // The .save() approach is generally preferred for middleware (like pre-save hooks) and more complex updates.

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Task not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while updating task.' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/productive-space/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (task.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'User not authorized to delete this task.' });
    }

    await task.remove(); // Or Task.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Task removed successfully.' });
  } catch (error) {
    console.error('Error deleting task:', error);
     if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Task not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error while deleting task.' });
  }
};
