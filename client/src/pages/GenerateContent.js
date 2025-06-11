import React, { useState } from 'react';
import axios from 'axios';
import '../styles/GenerateContent.css';

export default function GenerateContent() {
  const [form, setForm] = useState({
    contentType: 'Image', // default
    tone: 'professional',
    colors: '',
    tags: '',
    numberOfPosts: 1,
    keywords: ''
  });

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/content/generate',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setResult(res.data);
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      alert('Something went wrong. Please check the console.');
    }
    setLoading(false);
  };

  return (
    <div className="generate-content-page">
      <h1>Generate AI Content</h1>
      <form onSubmit={handleSubmit}>
        {/* Post Type Dropdown */}
        <select name="contentType" value={form.contentType} onChange={handleChange} required>
          <option value="Post">Post</option>
          <option value="Image">Image</option>
          <option value="Ad">Ad</option>
        </select>

        <input
          name="keywords"
          value={form.keywords}
          onChange={handleChange}
          placeholder="Enter keywords"
          required
        />
        <input
          name="tone"
          value={form.tone}
          onChange={handleChange}
          placeholder="Tone"
          required
        />
        <input
          name="colors"
          value={form.colors}
          onChange={handleChange}
          placeholder="Colors"
        />
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags"
        />
        <input
          name="numberOfPosts"
          type="number"
          min="1"
          value={form.numberOfPosts}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>

      {result && (
        <div className="output-section">
          {form.contentType === 'Image' && result.image ? (
            <>
              <h2>Generated Image:</h2>
              <img
                src={`data:image/png;base64,${result.image}`}
                alt="Generated"
                style={{ maxWidth: '100%' }}
              />
            </>
          ) : (
            <>
              <h2>Generated {form.contentType}:</h2>
              <pre>{result.content}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}
