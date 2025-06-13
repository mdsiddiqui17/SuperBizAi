const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required.'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
      required: [true, 'Task status is required.'],
    },
    dueDate: {
      type: Date,
      default: null, // Or remove default if no default due date is desired
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      required: [true, 'Task priority is required.'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Referencing the User model
      required: true,
      index: true, // Add an index for faster queries on userId
    },
    // Optional: Add tags or subtasks later if needed
    // tags: [{ type: String, trim: true }],
    // subTasks: [ { title: String, completed: Boolean } ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Optional: Add a pre-save hook or methods if needed in the future
// taskSchema.pre('save', function(next) {
//   // Example: if (!this.title) this.title = 'Untitled Task';
//   next();
// });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
