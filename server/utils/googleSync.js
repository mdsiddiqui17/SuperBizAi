
const { google } = require('googleapis');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:5000/api/google/callback'
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

const syncAppointmentToGoogle = async (userId, appointmentData) => {
  const user = await User.findById(userId);
  if (!user || !user.google || !user.google.tokens) {
    console.log('No Google tokens found for this user.');
    return;
  }

  oauth2Client.setCredentials(user.google.tokens);

  try {
    const event = {
      summary: appointmentData.service,
      description: appointmentData.notes || '',
      start: { dateTime: new Date(appointmentData.date).toISOString() },
      end: {
        dateTime: new Date(
          new Date(appointmentData.date).getTime() + 30 * 60000
        ).toISOString(), // 30 mins
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    return response.data.id; // Return event ID to save in DB if needed
  } catch (error) {
    console.error('Error syncing appointment:', error.message);
  }
};

module.exports = syncAppointmentToGoogle;
