const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Note title is required.'],
      trim: true,
    },
    content: {
      type: String,
      trim: true,
      default: '',
    },
    tags: {
      type: [String], // Array of strings
      default: [],
      // Example of custom validator for tags if needed in future:
      // validate: [arrayLimit, '{PATH} exceeds the limit of 10 tags']
    },
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

// Example custom validator function (not used by default but shown for reference)
// function arrayLimit(val) {
//   return val.length <= 10;
// }

// Optional: Add a pre-save hook or methods if needed in the future
// noteSchema.pre('save', function(next) {
//   // if (!this.title) this.title = 'Untitled Note';
//   next();
// });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
