import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SalesFormModal from './SalesFormModal';

export default function SalesTab() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', name: '', email: '', phone: '', company: '', status: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const fetchLeads = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(res.data);
      setFilteredLeads(res.data);
    } catch (err) {
      alert('Failed to fetch leads');
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleFilter = () => {
    let result = leads.filter(lead =>
      (!filters.keyword || lead.notes?.toLowerCase().includes(filters.keyword.toLowerCase())) &&
      (!filters.name || lead.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.email || lead.email?.toLowerCase().includes(filters.email.toLowerCase())) &&
      (!filters.phone || lead.phone?.includes(filters.phone)) &&
      (!filters.company || lead.company?.toLowerCase().includes(filters.company.toLowerCase())) &&
      (!filters.status || lead.status === filters.status)
    );
    setFilteredLeads(result);
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setShowModal(true);
  };

  return (
    <div className="sales-tab">
      <div className="filter-bar">
        <input placeholder="Keyword" onChange={e => setFilters({ ...filters, keyword: e.target.value })} />
        <input placeholder="Name" onChange={e => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Email" onChange={e => setFilters({ ...filters, email: e.target.value })} />
        <input placeholder="Phone" onChange={e => setFilters({ ...filters, phone: e.target.value })} />
        <input placeholder="Company" onChange={e => setFilters({ ...filters, company: e.target.value })} />
        <select onChange={e => setFilters({ ...filters, status: e.target.value })}>
          <option value="">Status</option>
          <option value="Prospecting">Prospecting</option>
          <option value="Contacted">Contacted</option>
          <option value="Converted">Converted</option>
          <option value="Failed">Failed</option>
        </select>
        <button onClick={handleFilter}>Search</button>
        <button onClick={() => setFilteredLeads(leads)}>View All</button>
        <button onClick={() => { setEditingLead(null); setShowModal(true); }}>+ Add Lead</button>
      </div>

      <table className="leads-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Company</th><th>Notes</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {filteredLeads.map(lead => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.phone}</td>
              <td>{lead.status}</td>
              <td>{lead.company || '-'}</td>
              <td>
                {lead.notes?.split('\n').map((note, i) => (
                  <div key={i}>• {note}</div>
                ))}
              </td>
              <td><button onClick={() => handleEdit(lead)}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <SalesFormModal
          lead={editingLead}
          onClose={() => setShowModal(false)}
          onRefresh={fetchLeads}
        />
      )}
    </div>
  );
}
