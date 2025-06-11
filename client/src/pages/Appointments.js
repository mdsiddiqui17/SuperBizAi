import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SyncCalendarButton from '../snippets/SyncCalendarButton';
import '../styles/Appointments.css';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ customerName: '', service: '', date: '', notes: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/appointments', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAppointments(res.data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const gAccess = new URLSearchParams(window.location.search).get('gAccess');

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/appointments/${editingId}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-google-token': gAccess
          }
        });
      } else {
        await axios.post('http://localhost:5000/api/appointments', form, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-google-token': gAccess
          }
        });
      }
      setForm({ customerName: '', service: '', date: '', notes: '' });
      setEditingId(null);
      fetchAppointments();
    } catch (err) {
      console.error('Save appointment error:', err);
    }
  };

  const handleEdit = (appt) => {
    setForm(appt);
    setEditingId(appt._id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Delete this appointment?')) {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAppointments();
    }
  };

  return (
    <div className="appointments-page">
      <h1>Appointments</h1>
      <SyncCalendarButton />
      <form onSubmit={handleSubmit}>
        <input value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} placeholder="Customer Name" required />
        <input value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} placeholder="Service" required />
        <input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Notes" />
        <button type="submit">{editingId ? 'Update' : 'Create'} Appointment</button>
      </form>

      <table>
        <thead>
          <tr><th>Customer</th><th>Service</th><th>Date</th><th>Notes</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {appointments.map(appt => (
            <tr key={appt._id}>
              <td>{appt.customerName}</td>
              <td>{appt.service}</td>
              <td>{new Date(appt.date).toLocaleString()}</td>
              <td>{appt.notes}</td>
              <td>
                <button onClick={() => handleEdit(appt)}>Edit</button>
                <button onClick={() => handleDelete(appt._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
