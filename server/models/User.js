const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String }, // Optional (for social logins)
  googleId: { type: String, unique: true, sparse: true },
  profilePictureUrl: { type: String, required: false },
  googleAccessToken: String,
  googleRefreshToken: String,

  // ✅ Notification Preferences
  notificationPrefs: {
    type: Object,
    default: {
      postFailures: true,
      postSuccess: true,
      reminders: true,
      weeklyReport: true,
      billingReminders: true
    }
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
