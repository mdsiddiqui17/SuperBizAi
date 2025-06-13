const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Template title is required.'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['note', 'task', 'custom'], // Predefined types
      required: [true, 'Template type is required.'],
    },
    structure: {
      // This will store the JSON structure for the template,
      // e.g., for a block-based editor or predefined fields.
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Template structure/content is required.'],
      default: {}, // Default to an empty object or appropriate structure
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Compound index for searching/sorting by type for a user
templateSchema.index({ userId: 1, type: 1 });
// Optional: Compound index for searching by title for a user
templateSchema.index({ userId: 1, title: 1 });


const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
