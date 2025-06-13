const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Reminder message is required.'],
      trim: true,
    },
    remindAt: {
      type: Date,
      required: [true, 'Reminder date and time are required.'],
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrenceRule: {
      // For storing iCalendar RRULE strings or custom recurrence patterns
      // e.g., "FREQ=WEEKLY;BYDAY=MO;INTERVAL=1"
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'snoozed'],
      default: 'pending',
      required: [true, 'Reminder status is required.'],
    },
    // You might add a 'snoozedUntil' field if you implement snoozing with specific times
    // snoozedUntil: { type: Date, default: null },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Referencing the User model
      required: true,
      index: true, // Add an index for faster queries on userId
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Index for querying reminders by user and reminder time (useful for fetching upcoming reminders)
reminderSchema.index({ userId: 1, remindAt: 1 });
// Index for querying reminders by user and status
reminderSchema.index({ userId: 1, status: 1 });


const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;
