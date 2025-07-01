// client/src/modules/Analytics/components/AnalyticsReport.js
import React from 'react';
import './AnalyticsReport.css';

export default function AnalyticsReport({ report }) {
  return (
    <div className="analytics-report p-4 mt-4 bg-light border rounded">
      <h5>AI Summary Report</h5>
      <p>{report || 'Click the button above to generate your AI-powered summary.'}</p>
    </div>
  );
}
