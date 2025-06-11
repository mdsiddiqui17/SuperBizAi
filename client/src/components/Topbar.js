import React from 'react';
import './Topbar.css'; // Optional styling

export default function Topbar() {
  let user = null;

  try {
    const rawUser = localStorage.getItem('user');
    if (rawUser && rawUser !== 'undefined') {
      user = JSON.parse(rawUser);
    }
  } catch (error) {
    console.error('Invalid JSON in localStorage:', error);
  }

  return (
    <div className="topbar">
      {user?.name ? (
        <h2>Welcome back, {user.name}</h2>
      ) : (
        <h2>Welcome to SuperBiz AI</h2>
      )}
    </div>
  );
}
