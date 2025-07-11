import React, { useState } from 'react';
import axios from 'axios';

export default function StrategyAssistantTab() {
  const [form, setForm] = useState({
    platform: '',
    industry: '',
    from: '',
    to: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/content/strategy', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data?.strategy || 'No strategy generated.');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Failed to generate strategy.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h4>📱 Social Media Strategy Assistant</h4>
      <form className="row gy-3 mt-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label className="form-label">Platform Focus</label>
          <select name="platform" className="form-select" value={form.platform} onChange={handleChange} required>
            <option value="">Select...</option>
            <option>Instagram</option>
            <option>Facebook</option>
            <option>LinkedIn</option>
            <option>TikTok</option>
            <option>Multiple</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Industry / Business Type</label>
          <input name="industry" className="form-control" value={form.industry} onChange={handleChange} required />
        </div>
        <div className="col-md-12">
          <label className="form-label">Date Range</label>
          <div className="d-flex gap-2">
            <input name="from" type="month" className="form-control" value={form.from} onChange={handleChange} />
            <input name="to" type="month" className="form-control" value={form.to} onChange={handleChange} />
          </div>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Analyzing...' : 'Generate Strategy'}
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-4">
          <h5>Generated Strategy:</h5>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
