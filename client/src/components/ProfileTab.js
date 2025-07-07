import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ProfileTab.css';

export default function ProfileTab() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/account/profile', {
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profile updated successfully');
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-tab">
      <h4>Profile Information</h4>
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" />
      <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="Current Password" />
      <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="New Password" />
      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm New Password" />
      <button className="btn btn-success mt-3" onClick={handleSave} disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
