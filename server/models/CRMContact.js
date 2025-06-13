const mongoose = require('mongoose');

const crmContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Contact name is required.'],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true, // Store emails in lowercase for consistency
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, // Basic email format regex
        'Please fill a valid email address',
      ],
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    tags: {
      type: [String],
      trim: true, // Ensures individual tags are trimmed
      default: [],
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

// Optional: Compound index for searching by name and company for a user
crmContactSchema.index({ userId: 1, name: 1, company: 1 });

const CRMContact = mongoose.model('CRMContact', crmContactSchema);

module.exports = CRMContact;
