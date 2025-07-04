import React, { useState } from 'react';

export default function ProfileTab() {
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return setError(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      );
    }

    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match.');
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/account/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="profile-tab container py-4">
      <h5>Update Profile</h5>
      <div className="mb-3">
        <label className="form-label">Full Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <hr />

      <h5 className="mt-4">Change Password</h5>
      <form onSubmit={handlePasswordChange}>
        <div className="mb-3">
          <label className="form-label">Current Password</label>
          <input
            type="password"
            className="form-control"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm New Password</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
        {success && <div className="alert alert-success mt-2">{success}</div>}
        <button type="submit" className="btn btn-dark mt-2">Change Password</button>
      </form>
    </div>
  );
}
