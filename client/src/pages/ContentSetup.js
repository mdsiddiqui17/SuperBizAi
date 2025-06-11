import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ContentSetup.css';

export default function ContentSetup() {
  const [form, setForm] = useState({
    companyName: '',
    services: '',
    brandColors: '',
    brandNotes: ''
  });
  const [logo, setLogo] = useState(null);
  const [guidelines, setGuidelines] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));
    if (logo) data.append('logo', logo);
    if (guidelines) data.append('guidelines', guidelines);

    try {
      await axios.post('http://localhost:5000/api/content/setup', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Profile saved successfully');
    } catch (err) {
      alert('Error saving profile');
    }
  };

  return (
    <div className="content-setup-page">
      <h2>Set up your Brand Profile</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Company Name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
        <input type="text" placeholder="Services/Products" value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} required />
        <input type="text" placeholder="Brand Colors" value={form.brandColors} onChange={(e) => setForm({ ...form, brandColors: e.target.value })} />
        <textarea placeholder="Brand Notes or Guidelines" value={form.brandNotes} onChange={(e) => setForm({ ...form, brandNotes: e.target.value })} />
        <label>Upload Logo:</label>
        <input type="file" onChange={(e) => setLogo(e.target.files[0])} />
        <label>Upload Brand Guidelines (PDF):</label>
        <input type="file" onChange={(e) => setGuidelines(e.target.files[0])} />
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}
