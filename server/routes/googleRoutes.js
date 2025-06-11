const express = require('express');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:5000/api/google/callback' // Make sure this matches your Google OAuth setup
);

// Step 1: Redirect user to Google for consent
router.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.events'],
    prompt: 'consent'
  });
  res.redirect(url);
});

// Step 2: Google redirects here after consent
router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store tokens in session or send them back to frontend
    // For now, send via redirect as query params
    const redirectUrl = `http://localhost:3000/dashboard?gAccess=${tokens.access_token}&gRefresh=${tokens.refresh_token}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('🔴 Google OAuth Callback Error:', error);
    res.status(400).json({ message: 'Google authentication failed' });
  }
});

// Optional: If you want to fetch events (requires valid access_token set)
router.get('/events', async (req, res) => {
  const { access_token } = req.query;

  if (!access_token) return res.status(400).json({ message: 'Access token missing' });

  try {
    oauth2Client.setCredentials({ access_token });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const response = await calendar.events.list({
      calendarId: 'primary',
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    res.json(response.data.items);
  } catch (err) {
    console.error('🔴 Fetching Google Calendar events failed:', err.message);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

module.exports = router;
