// client/src/modules/Analytics/pages/AnalyticsPage.js
import React, { useState } from 'react';
import AnalyticsCard from '../components/AnalyticsCard';
import AnalyticsReport from '../components/AnalyticsReport';
import { FaUsers, FaChartLine, FaStar, FaBoxOpen, FaUserTie } from 'react-icons/fa';
import '../../../styles/Analytics.css';


export default function AnalyticsPage() {
  const [report, setReport] = useState('');

  const handleGenerateReport = async () => {
    // Placeholder for AI report generation call
    setReport('Based on the latest analytics, your social media engagement is above industry average. However, negative reviews have increased 15% this month. CRM lead conversion is stable. Competitors have slightly higher product launch frequency.');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Analytics Dashboard</h2>
      <div className="row g-4">
        <div className="col-md-4"><AnalyticsCard title="Competitor Insights" value="4 Tracked" icon={<FaUsers />} /></div>
        <div className="col-md-4"><AnalyticsCard title="Social Media Engagement" value="↑ 18%" icon={<FaChartLine />} /></div>
        <div className="col-md-4"><AnalyticsCard title="Reviews" value="85% Positive" icon={<FaStar />} /></div>
        <div className="col-md-4"><AnalyticsCard title="Product Sales" value="1,230 Units" icon={<FaBoxOpen />} /></div>
        <div className="col-md-4"><AnalyticsCard title="CRM Leads" value="245 Leads" icon={<FaUserTie />} /></div>
      </div>
      <div className="text-center mt-5">
        <button className="btn btn-primary" onClick={handleGenerateReport}>Generate AI Summary</button>
      </div>
      <AnalyticsReport report={report} />
    </div>
  );
}
