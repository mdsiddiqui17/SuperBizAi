import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import DashboardCard from '../components/DashboardCard';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [scheduledCount, setScheduledCount] = useState(0);
  const [productCount, setProductCount] = useState(0);

  const handleCardClick = (path) => {
    navigate(path); // 🔥 Keep this simple
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
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Topbar />
        <div className="cards">
          <DashboardCard
            title="CRM Leads"
            value="24"
            onClick={() => handleCardClick('/leads')}
          />
          <DashboardCard
            title="Appointments"
            value="8"
            onClick={() => handleCardClick('/appointments')}
          />
          <DashboardCard
            title="Smart Products"
            value={productCount}
            onClick={() => handleCardClick('/products')}
          />
          <DashboardCard
            title="Content Engine"
            value="AI"
            onClick={() => handleCardClick('/content-setup')}
          />
          <DashboardCard
            title="Content Generator"
            value="New"
            onClick={() => handleCardClick('/generate-content')}
          />
          <DashboardCard
            title="Scheduled Posts"
            value={scheduledCount}
            onClick={() => handleCardClick('/scheduler')}
          />
          <DashboardCard
            title="Productive Space"
            value="Workspace"
            onClick={() => handleCardClick('/productive/tasks')}
          />
          <DashboardCard
            title="Analytics"
            value="Insights"
            onClick={() => handleCardClick('/analytics')}
          />
        </div>
      </div>
    </div>
  );
}
