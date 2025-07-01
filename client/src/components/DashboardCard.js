import React from 'react';
import '../styles/DashboardCard.css';

export default function DashboardCard({ title, value, onClick }) {
  return (
    <div
      className="dashboard-card"
      onClick={onClick}
      style={{
        backgroundColor: '#1d2d44',
        color: '#f0ebd8',
        padding: '20px',
        borderRadius: '8px',
        width: '250px',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s ease',
      }}
    >
      <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>{title}</h4>
      <h2 style={{ fontWeight: 'bold', fontSize: '2rem' }}>{value}</h2>
    </div>
  );
}
