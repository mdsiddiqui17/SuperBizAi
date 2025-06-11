import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  // ✅ Safe JSON parsing
  const rawUser = localStorage.getItem('user');
  let user = null;

  try {
    if (rawUser && rawUser !== 'undefined') {
      user = JSON.parse(rawUser);
    }
  } catch (err) {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src="/Logo.png" alt="SuperBiz AI Logo" className="logo" />
      </div>
      <nav className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/account">Account Settings</Link>
        {isLoggedIn ? (
          <>
            {user?.name && <span className="user-greeting">Hi, {user.name}</span>}
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
