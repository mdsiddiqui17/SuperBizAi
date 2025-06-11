const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const Appointment = require('../models/Appointment');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  const appointments = await Appointment.find({ user: req.user.userId });
  res.json(appointments);
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const newAppointment = new Appointment({ ...req.body, user: req.user.userId });
    await newAppointment.save();

    const gToken = req.headers['x-google-token'];
    if (gToken) {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: gToken });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: req.body.service,
          description: req.body.notes,
          start: { dateTime: new Date(req.body.date).toISOString() },
          end: { dateTime: new Date(new Date(req.body.date).getTime() + 30 * 60000).toISOString() },
        }
      });
    }

    res.status(201).json(newAppointment);
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ message: 'Failed to create appointment' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const updated = await Appointment.findOneAndUpdate(
    { _id: req.params.id, user: req.user.userId },
    req.body,
    { new: true }
  );
  res.json(updated);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  await Appointment.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
  res.json({ message: 'Appointment deleted' });
});

module.exports = router;
