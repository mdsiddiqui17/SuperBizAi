import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>SuperBiz AI</h2>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/account">Account Settings</Link>
        <Link to="/login">Logout</Link>
      </nav>
    </div>
  );
}
