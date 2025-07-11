import React, { useState } from 'react';
import '../styles/ContentGeneratorTabs.css';
import MonthlyPlannerTab from '../components/MonthlyPlannerTab';
import StrategyAssistantTab from '../components/StrategyAssistantTab';
import ContentCreatorTab from '../components/ContentCreatorTab';

export default function ContentGeneratorTabs() {
  const [activeTab, setActiveTab] = useState('monthly');

  return (
    <div className="content-generator-tabs container py-4">
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'monthly' ? 'active' : ''}`} onClick={() => setActiveTab('monthly')}>
            📅 Monthly Marketing Planner
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'strategy' ? 'active' : ''}`} onClick={() => setActiveTab('strategy')}>
            📱 Social Media Strategy Assistant
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'creator' ? 'active' : ''}`} onClick={() => setActiveTab('creator')}>
            🤖 AI Content Creator
          </button>
        </li>
      </ul>

      <div className="tab-content bg-white p-4 rounded shadow-sm">
        {activeTab === 'monthly' && <MonthlyPlannerTab />}
        {activeTab === 'strategy' && <StrategyAssistantTab />}
        {activeTab === 'creator' && <ContentCreatorTab />}
      </div>
    </div>
  );
}
