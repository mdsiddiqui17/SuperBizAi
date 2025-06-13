const mongoose = require('mongoose');

const workspaceLinkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Link name is required.'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'URL is required.'],
      trim: true,
      match: [
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, // Basic URL format regex
        'Please fill a valid URL',
      ],
    },
    category: {
      type: String,
      trim: true,
      default: 'General', // Default category if not specified
    },
    icon: {
      // Could be a Font Awesome class, an emoji, or a small image URL/identifier
      type: String,
      trim: true,
      default: '',
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

// Optional: Compound index for searching/sorting by category for a user
workspaceLinkSchema.index({ userId: 1, category: 1 });
// Optional: Compound index for searching by name for a user
workspaceLinkSchema.index({ userId: 1, name: 1 });


const WorkspaceLink = mongoose.model('WorkspaceLink', workspaceLinkSchema);

module.exports = WorkspaceLink;
