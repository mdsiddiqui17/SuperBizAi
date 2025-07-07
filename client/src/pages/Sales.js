import React, { useState, useEffect } from 'react';
import '../styles/Sales.css';
import OrdersTab from '../components/OrdersTab';
import SalesGoalsTab from '../components/SalesGoalsTab';

export default function Sales() {
  const [activeTab, setActiveTab] = useState('sales');
  const [showModal, setShowModal] = useState(false);
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'New',
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchLeads = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setLeads(data);
      setFilteredLeads(data);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSearch = () => {
    let results = [...leads];
    if (search) {
      results = results.filter(lead =>
        lead.name?.toLowerCase().includes(search.toLowerCase()) ||
        lead.email?.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone?.includes(search) ||
        lead.company?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter !== 'All') {
      results = results.filter(lead => lead.status === statusFilter);
    }
    setFilteredLeads(results);
  };

  const handleViewAll = () => {
    setSearch('');
    setStatusFilter('All');
    setFilteredLeads(leads);
  };

  const handleEdit = (lead) => {
    setForm(lead);
    setEditingId(lead._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await fetch(`http://localhost:5000/api/leads/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchLeads();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const endpoint = editingId
        ? `http://localhost:5000/api/leads/${editingId}`
        : `http://localhost:5000/api/leads`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Submission failed');
      setShowModal(false);
      setForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'New',
        notes: ''
      });
      setEditingId(null);
      fetchLeads();
    } catch (err) {
      console.error(err);
      alert('Failed to save lead');
    }
  };

  return (
    <div className="sales-container">
      <div className="tabs">
        <button className={activeTab === 'sales' ? 'active' : ''} onClick={() => setActiveTab('sales')}>Sales</button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Orders</button>
        <button className={activeTab === 'goals' ? 'active' : ''} onClick={() => setActiveTab('goals')}>Sales Goals & Reports</button>
      </div>

      <div className="tab-content">
        {activeTab === 'sales' && (
          <>
            <div className="sales-controls">
              <input
                type="text"
                placeholder="Search by name, email, phone, company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
                <option value="Prospecting">Prospecting</option>
                <option value="Failed">Failed</option>
              </select>
              <button onClick={handleSearch}>Search</button>
              <button onClick={handleViewAll}>View All</button>
              <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Contact</button>
            </div>

            <table className="sales-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead._id}>
                    <td>{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>{lead.phone}</td>
                    <td>{lead.company || '-'}</td>
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

            {showModal && (
              <div className="modal-overlay" onClick={() => setShowModal(false)}>
                <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                  <h3>{editingId ? 'Edit Contact' : 'Add Contact'}</h3>
                  <form onSubmit={handleSubmit}>
                    <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    <input placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Converted</option>
                      <option>Prospecting</option>
                      <option>Failed</option>
                    </select>
                    <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                    <div className="modal-actions">
                      <button type="submit">{editingId ? 'Update' : 'Add'}</button>
                      <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'goals' && <SalesGoalsTab />}
      </div>
    </div>
  );
}
