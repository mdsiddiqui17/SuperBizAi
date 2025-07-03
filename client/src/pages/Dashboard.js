import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [scheduledCount, setScheduledCount] = useState(0);
  const [productCount, setProductCount] = useState(0);

  const handleCardClick = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchScheduledPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/scheduler/mine', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const upcoming = data.filter(post => new Date(post.scheduledTime) > new Date());
        setScheduledCount(upcoming.length);
      } catch (err) {
        console.error('Failed to load scheduled posts:', err.message);
      }
    };

    const fetchSmartProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProductCount(data.length);
      } catch (err) {
        console.error('Failed to load smart products:', err.message);
      }
    };

    fetchScheduledPosts();
    fetchSmartProducts();
  }, []);

  return (
    <div className="dashboard-content">
      <h2 className="dashboard-heading">Welcome to your Dashboard</h2>
      <div className="cards">
        <DashboardCard title="CRM Leads" value="24" onClick={() => handleCardClick('/leads')} />
        <DashboardCard title="Appointments" value="8" onClick={() => handleCardClick('/appointments')} />
        <DashboardCard title="Smart Products" value={productCount} onClick={() => handleCardClick('/products')} />
        <DashboardCard title="Content Generator" value="New" onClick={() => handleCardClick('/generate-content')} />
        <DashboardCard title="Scheduled Posts" value={scheduledCount} onClick={() => handleCardClick('/scheduler')} />
        <DashboardCard title="Smart Forms" value="Forms" onClick={() => handleCardClick('/smart-forms')} />
        <DashboardCard title="Productive Space" value="Workspace" onClick={() => handleCardClick('/productive/tasks')} />
        <DashboardCard title="Analytics" value="Insights" onClick={() => handleCardClick('/analytics')} />
        <DashboardCard title="Competitor Analysis" value="SEO + Report" onClick={() => handleCardClick('/competitor-analysis')} />
      </div>
    </div>
  );
}
