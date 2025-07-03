import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const rawUser = localStorage.getItem('user');
  let user = null;

  try {
    if (rawUser && rawUser !== 'undefined') {
      user = JSON.parse(rawUser);
    }
  } catch {
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

      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {!isLoggedIn ? (
          <>
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/pricing" className="nav-link">Pricing</Link>
            <Link to="/contact" className="nav-link">Contact Us</Link>
            <Link to="/login" className="nav-link teal-link">Log In</Link>
            <Link to="/register" className="nav-link get-started">Get Started</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <div className="dropdown">
              <span className="nav-link dropdown-toggle">Tools ▾</span>
              <div className="dropdown-menu">
                <Link to="/leads">CRM</Link>
                <Link to="/appointments">Appointments</Link>
                <Link to="/content-setup">Content Engine</Link>
                <Link to="/generate-content">Content Generator</Link>
                <Link to="/create-ad">Ad Creator</Link>
                <Link to="/scheduler">Scheduler</Link>
                <Link to="/products">Smart Products</Link>
                <Link to="/smart-forms">Smart Forms</Link>
                <Link to="/productive/tasks">Productive Space</Link>
                <Link to="/analytics">Analytics</Link>
                <Link to="/competitor">Competitor Analysis</Link>
              </div>
            </div>
            <Link to="/account" className="nav-link">Account Settings</Link>
            <Link to="/support" className="nav-link">Support</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        )}
      </nav>

      <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
    </header>
  );
}
