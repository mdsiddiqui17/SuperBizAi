import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Auth.css';
import { useNavigate } from 'react-router-dom';
import GoogleSignInButton from '../components/GoogleSignInButton'; // Added import

// Assuming Register component might now also receive setIsLoggedIn for immediate UI update
export default function Register({ setIsLoggedIn }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleGoogleAuthSuccess = (userData) => {
    console.log('Google Auth Success in Register Page (treated as login/registration):', userData);
    if (setIsLoggedIn) { // Check if prop is passed
       setIsLoggedIn(true);
    }
    navigate('/dashboard'); // Or your desired redirect path
    // toast.success(`Welcome, ${userData.name}! Your account is ready.`);
  };

  const handleGoogleAuthError = (errorMessage) => {
    console.error('Google Auth Error in Register Page:', errorMessage);
    // toast.error(errorMessage);
    alert(`Google Sign-Up/Sign-In Failed: ${errorMessage}`);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return alert('Passwords do not match');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      // If setIsLoggedIn is passed, call it for immediate UI update
      if (setIsLoggedIn) {
        setIsLoggedIn(true);
      }
      navigate('/dashboard');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register for SuperBiz AI</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          required
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          required
          value={form.confirmPassword}
          onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
        />
        <button type="submit">Register</button>
      </form>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>OR</div>
      <GoogleSignInButton
        onAuthSuccess={handleGoogleAuthSuccess}
        onAuthError={handleGoogleAuthError}
      />
    </div>
  );
}
