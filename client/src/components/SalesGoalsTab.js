import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function SalesGoalsTab() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/sales/goals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    };
    fetchGoals();
  }, []);

  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Target',
        data: data.map(item => item.target),
        borderColor: 'rgba(255,99,132,1)',
        fill: false
      },
      {
        label: 'Achieved',
        data: data.map(item => item.achieved),
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: false
      }
    ]
  };

  return (
    <div>
      <h3>Sales Goals & Reports</h3>
      {data.length > 0 ? (
        <Line data={chartData} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}
