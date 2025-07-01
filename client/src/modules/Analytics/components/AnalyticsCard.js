// client/src/modules/Analytics/components/AnalyticsCard.js
import React from 'react';
import './AnalyticsCard.css';

export default function AnalyticsCard({ title, value, icon }) {
  return (
    <div className="analytics-card shadow-sm">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h6 className="text-muted">{title}</h6>
          <h4>{value}</h4>
        </div>
        <div className="icon-box">
          {icon}
        </div>
      </div>
    </div>
  );
}
