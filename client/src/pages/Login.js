import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Auth.css';
import { useNavigate } from 'react-router-dom';
import GoogleSignInButton from '../components/GoogleSignInButton'; // Added import

export default function Login({ setIsLoggedIn }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleGoogleAuthSuccess = (userData) => {
    console.log('Google Auth Success in Login Page:', userData);
    if (setIsLoggedIn) { // Check if prop is passed
      setIsLoggedIn(true);
    }
    navigate('/dashboard'); // Or your desired redirect path
    // Optionally, show a success toast if react-toastify is integrated
    // import { toast } from 'react-toastify';
    // toast.success(`Welcome, ${userData.name}!`);
  };

  const handleGoogleAuthError = (errorMessage) => {
    console.error('Google Auth Error in Login Page:', errorMessage);
    // Display error to user (e.g., using react-toastify or a state variable for an error message)
    // import { toast } from 'react-toastify';
    // toast.error(errorMessage);
    alert(`Google Sign-In Failed: ${errorMessage}`); // Simple alert as fallback
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login to SuperBiz AI</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>OR</div>
      <GoogleSignInButton
        onAuthSuccess={handleGoogleAuthSuccess}
        onAuthError={handleGoogleAuthError}
      />
    </div>
  );
}
