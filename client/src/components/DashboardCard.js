import React from 'react';
import { Link } from 'react-router-dom'; // For the button
import './DashboardCard.css'; // For custom styles

const DashboardCard = ({
  title,
  mainStat,
  mainStatLabel,
  subStats, // Expected format: [{ label: 'Label1', value: 'Value1' }, { label: 'Label2', value: 'Value2' }]
  iconClass, // e.g., 'fas fa-calendar-alt' for Font Awesome
  buttonLink,
  buttonText,
  cardColorStyle // e.g., { backgroundColor: '#f0f8ff', borderColor: '#d6e9f8' }
}) => {
  return (
    <div className="card dashboard-card h-100 shadow-sm" style={cardColorStyle}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className="card-title mb-0">{title || 'Untitled Card'}</h5>
          {iconClass && <i className={`dashboard-card-icon ${iconClass} fa-2x text-muted`}></i>}
        </div>

        <div className="main-stat my-3">
          <h2 className="display-4 fw-bold">{mainStat !== undefined ? mainStat : '-'}</h2>
          {mainStatLabel && <p className="text-muted mb-0">{mainStatLabel}</p>}
        </div>

        {subStats && subStats.length > 0 && (
          <ul className="list-unstyled sub-stats-list mb-3">
            {subStats.map((stat, index) => (
              <li key={index} className="d-flex justify-content-between align-items-center py-1">
                <span>{stat.label}:</span>
                <span className="fw-semibold">{stat.value}</span>
              </li>
            ))}
          </ul>
        )}

        {buttonLink && buttonText && (
          <Link to={buttonLink} className="btn btn-primary stretched-link">
            {buttonText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
