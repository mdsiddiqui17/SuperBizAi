import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CompetitorPage() {
  const [competitors, setCompetitors] = useState([{ name: '', website: '', notes: '' }]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const updated = [...competitors];
    updated[index][field] = value;
    setCompetitors(updated);
  };

  const addCompetitor = () => {
    setCompetitors([...competitors, { name: '', website: '', notes: '' }]);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post('/api/competitor/analyze', { competitors }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompetitors([{ name: '', website: '', notes: '' }]);
      fetchReports();
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/competitor/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Competitor Analysis</h2>

      {competitors.map((comp, idx) => (
        <div key={idx} className="mb-3">
          <input
            className="form-control mb-1"
            placeholder="Competitor Name"
            value={comp.name}
            onChange={(e) => handleChange(idx, 'name', e.target.value)}
          />
          <input
            className="form-control mb-1"
            placeholder="Website"
            value={comp.website}
            onChange={(e) => handleChange(idx, 'website', e.target.value)}
          />
          <textarea
            className="form-control"
            placeholder="Notes"
            value={comp.notes}
            onChange={(e) => handleChange(idx, 'notes', e.target.value)}
          />
        </div>
      ))}

      <button className="btn btn-secondary me-2" onClick={addCompetitor}>+ Add Competitor</button>
      <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Generating...' : 'Generate AI Report'}
      </button>

      <hr />
      <h4>Previous Reports</h4>
      {reports.length === 0 && <p>No reports yet.</p>}
      {reports.map((report) => (
        <div key={report._id} className="alert alert-light">
          <strong>Date:</strong> {new Date(report.createdAt).toLocaleString()}<br />
          <strong>Summary:</strong><br /> {report.aiSummary}
        </div>
      ))}
    </div>
  );
}
