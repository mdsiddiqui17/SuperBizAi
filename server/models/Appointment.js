const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customerName: String,
  service: String,
  date: Date,
  notes: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Appointment', appointmentSchema);