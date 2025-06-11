
import React from 'react';
import './DashboardCard.css';

export default function DashboardCard({ title, value, onClick }) {
  return (
    <div
      className="dashboard-card"
      onClick={() => {
        console.log(`Clicked on: ${title}`);
        if (onClick) onClick();
      }}
    >
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
