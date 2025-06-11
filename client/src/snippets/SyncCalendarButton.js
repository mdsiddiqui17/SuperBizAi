import React from 'react';
import '../styles/appointmentsButton.css';

export default function SyncCalendarButton() {
  const handleSync = () => {
    window.open('http://localhost:5000/api/google/auth/google', '_self');
  };

  return (
    <button className="sync-calendar-btn" onClick={handleSync}>
      Sync with Google Calendar
    </button>
  );
}
