import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState({
    postFailures: false,
    postSuccess: true,
    reminders: true,
    weeklyReport: true,
    billingReminders: true
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await axios.get('/api/account/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching preferences:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, [token]);

  const handleToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const savePreferences = async () => {
    try {
      await axios.put('/api/account/notifications', notifications, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Preferences saved.');
    } catch (err) {
      console.error('Error saving preferences:', err);
      alert('Error saving preferences.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h4>Notification Preferences</h4>
      {Object.entries({
        postFailures: 'Post Failures',
        postSuccess: 'Post Published Confirmation',
        reminders: 'Reminders',
        weeklyReport: 'Weekly Analytics Report',
        billingReminders: 'Billing & Payment Reminders'
      }).map(([key, label]) => (
        <div className="form-check" key={key}>
          <input type="checkbox" className="form-check-input" id={key} checked={notifications[key]} onChange={() => handleToggle(key)} />
          <label className="form-check-label" htmlFor={key}>{label}</label>
        </div>
      ))}
      <button className="btn btn-primary mt-3" onClick={savePreferences}>Save</button>
    </div>
  );
}
