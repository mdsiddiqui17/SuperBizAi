const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String }, // No longer explicitly required at schema level
  googleId: { type: String, unique: true, sparse: true },
  profilePictureUrl: { type: String, required: false },
  googleAccessToken: String,
  googleRefreshToken: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);