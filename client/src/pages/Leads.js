
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Leads.css';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', status: 'New', notes: '' });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchLeads = async () => {
    const token = localStorage.getItem('token');
    console.log("🔥 Sending token:", token);

    try {
      const res = await axios.get('http://localhost:5000/api/leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("✅ Response:", res.data);
      setLeads(res.data);
      setFilteredLeads(res.data);
    } catch (err) {
      console.error("❌ Error fetching leads:", err.response?.data || err.message);
      alert('Failed to fetch leads');
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    let updated = [...leads];
    if (statusFilter !== 'All') {
      updated = updated.filter(lead => lead.status === statusFilter);
    }
    if (search) {
      updated = updated.filter(lead =>
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone.includes(search)
      );
    }
    setFilteredLeads(updated);
  }, [search, statusFilter, leads]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/leads/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/leads', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setForm({ name: '', email: '', phone: '', status: 'New', notes: '' });
      setEditingId(null);
      fetchLeads();
    } catch (err) {
      alert('Error saving lead');
    }
  };

  const handleEdit = (lead) => {
    setForm(lead);
    setEditingId(lead._id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await axios.delete(`http://localhost:5000/api/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLeads();
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Status", "Notes"];
    const rows = filteredLeads.map(lead => [lead.name, lead.email, lead.phone, lead.status, lead.notes]);

    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="leads-page">
      <h1>CRM Leads</h1>

      <div className="lead-controls">
        <input type="text" placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Converted">Converted</option>
        </select>
        <button onClick={exportToCSV}>Export CSV</button>
      </div>

      <form className="lead-form" onSubmit={handleSubmit}>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" required />
        <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" />
        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          <option>New</option>
          <option>Contacted</option>
          <option>Converted</option>
        </select>
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Notes" />
        <button type="submit">{editingId ? 'Update Lead' : 'Add Lead'}</button>
      </form>

      <table className="leads-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Notes</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {filteredLeads.map(lead => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.phone}</td>
              <td>{lead.status}</td>
              <td>{lead.notes}</td>
              <td>
                <button onClick={() => handleEdit(lead)}>Edit</button>
                <button onClick={() => handleDelete(lead._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
