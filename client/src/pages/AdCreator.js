import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdCreator.css';

export default function AdCreator() {
  const [contentText, setContentText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ads, setAds] = useState([]);
  const [platform, setPlatform] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');

  const token = localStorage.getItem('token');

  const generateAd = async () => {
    const res = await axios.post('http://localhost:5000/api/ad/generate', { contentText }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setImageUrl(res.data.imageUrl);
    fetchAds();
  };

  const saveAd = async () => {
    await axios.post('http://localhost:5000/api/ad/save', { contentText, imageUrl }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchAds();
  };

  const scheduleAd = async (adId) => {
    await axios.post('http://localhost:5000/api/ad/schedule', { adId, platform, scheduledFor }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchAds();
  };

  const fetchAds = async () => {
    const res = await axios.get('http://localhost:5000/api/ad/list', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAds(res.data);
  };

  useEffect(() => { fetchAds(); }, []);

  return (
    <div className="ad-creator-container">
      <h1>AI Ad Generator & Scheduler</h1>
      <textarea placeholder="Enter post text..." value={contentText} onChange={e => setContentText(e.target.value)} />
      <div className="buttons">
        <button onClick={generateAd}>Generate Ad</button>
        <button onClick={saveAd}>Save Custom Ad</button>
      </div>
      {imageUrl && <img src={imageUrl} alt="Generated" className="preview" />}

      <div className="schedule-form">
        <select value={platform} onChange={e => setPlatform(e.target.value)}>
          <option value="">Select Platform</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="x">X (Twitter)</option>
        </select>
        <input type="datetime-local" value={scheduledFor} onChange={e => setScheduledFor(e.target.value)} />
        <button onClick={() => scheduleAd(ads[0]?._id)}>Schedule Latest Ad</button>
      </div>

      <h2>My Ads</h2>
      <ul>
        {ads.map(ad => (
          <li key={ad._id}>
            <p>{ad.contentText}</p>
            {ad.imageUrl && <img src={ad.imageUrl} alt="Ad" width="200" />}
            <p>Status: {ad.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
