import React, { useState } from 'react';
import axios from 'axios';

export default function ContentCreatorTab() {
  const [form, setForm] = useState({
    contentType: 'Image',
    tone: '',
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
      const res = await axios.post('http://localhost:5000/api/content/generate', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data);
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      alert('Something went wrong. Check console.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h4>🤖 AI Content Creator</h4>
      <form className="row gy-3 mt-3" onSubmit={handleSubmit}>
        <div className="col-12">
          <label className="form-label">Post Objective</label>
          <textarea name="keywords" className="form-control" value={form.keywords} onChange={handleChange} rows="3" required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Tone</label>
          <input name="tone" className="form-control" value={form.tone} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Colors</label>
          <input name="colors" className="form-control" value={form.colors} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Tags</label>
          <input name="tags" className="form-control" value={form.tags} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Number of Posts</label>
          <input type="number" name="numberOfPosts" className="form-control" value={form.numberOfPosts} onChange={handleChange} min="1" />
        </div>
        <div className="col-md-4">
          <label className="form-label">Content Type</label>
          <select name="contentType" className="form-select" value={form.contentType} onChange={handleChange}>
            <option value="Image">Image</option>
            <option value="blog_post">Post</option>
            <option value="ad_copy">Ad</option>
          </select>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-info" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Post + Image'}
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-4">
          {form.contentType === 'Image' && result.image ? (
            <img src={result.image} alt="Generated" className="img-fluid" />
          ) : (
            <pre>{result.content}</pre>
          )}
        </div>
      )}
    </div>
  );
}
