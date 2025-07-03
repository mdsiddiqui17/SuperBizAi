import React from 'react';
import '../styles/DashboardCard.css';

export default function DashboardCard({ title, value, onClick }) {
  return (
    <div className="dashboard-card" onClick={onClick}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}
