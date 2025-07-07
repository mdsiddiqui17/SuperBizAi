import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SalesFormModal({ lead, onClose, onRefresh }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', status: 'Prospecting', company: '', notes: ''
  });

  useEffect(() => {
    if (lead) setForm(lead);
  }, [lead]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const timestamp = new Date().toLocaleString();
    const updatedNotes = lead?._id
      ? `${lead.notes}\n[${timestamp}] ${form.notes}`
      : `[${timestamp}] ${form.notes}`;

    try {
      if (lead?._id) {
        await axios.put(`http://localhost:5000/api/leads/${lead._id}`, { ...form, notes: updatedNotes }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/leads', { ...form, notes: updatedNotes }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      onRefresh();
      onClose();
    } catch (err) {
      alert('Failed to save');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>{lead ? 'Edit Lead' : 'Add Lead'}</h3>
        <form onSubmit={handleSubmit}>
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <input placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option>Prospecting</option>
            <option>Contacted</option>
            <option>Converted</option>
            <option>Failed</option>
          </select>
          <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
