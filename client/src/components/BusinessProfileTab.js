import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/BusinessProfileTab.css';

export default function BusinessProfileTab() {
  const [form, setForm] = useState({
    companyName: '',
    services: '',
    brandColors: '',
    brandNotes: ''
  });

  const [logo, setLogo] = useState(null);
  const [guidelines, setGuidelines] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/content/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profile = res.data;
        setForm({
          companyName: profile.companyName || '',
          services: profile.services || '',
          brandColors: profile.brandColors?.join(', ') || '',
          brandNotes: profile.brandNotes || ''
        });
        setProducts(profile.products || []);
      } catch (err) {
        console.error('Failed to fetch profile:', err.message);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));
    data.append('products', JSON.stringify(products));
    if (logo) data.append('logo', logo);
    if (guidelines) data.append('guidelines', guidelines);

    try {
      await axios.post('http://localhost:5000/api/content/setup', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('✅ Brand profile saved!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = () => {
    if (!newProduct.name.trim() || !newProduct.price || isNaN(newProduct.price)) {
      alert("Please enter a valid product name and numeric price.");
      return;
    }
    setProducts([...products, { name: newProduct.name.trim(), price: parseFloat(newProduct.price) }]);
    setNewProduct({ name: '', price: '' });
  };

  const deleteProduct = (index) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
  };

  return (
    <div className="business-profile-tab">
      <h4>Business Profile Setup</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Company Name"
          value={form.companyName}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Services / Specialization"
          value={form.services}
          onChange={(e) => setForm({ ...form, services: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Brand Colors (comma-separated)"
          value={form.brandColors}
          onChange={(e) => setForm({ ...form, brandColors: e.target.value })}
        />

        <textarea
          placeholder="Brand Notes / Content Guidelines"
          value={form.brandNotes}
          onChange={(e) => setForm({ ...form, brandNotes: e.target.value })}
        />

        <label>Upload Logo:</label>
        <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} />

        <label>Upload Brand Guidelines (PDF):</label>
        <input type="file" accept=".pdf" onChange={(e) => setGuidelines(e.target.files[0])} />

        <div className="product-entry">
          <h5>Products / Services with Pricing</h5>
          <div className="product-inputs">
            <input
              type="text"
              placeholder="Product / Service Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Price ($)"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <button type="button" onClick={addProduct}>➕ Add</button>
          </div>

          <ul className="product-list">
            {products.map((p, idx) => (
              <li key={idx}>
                <strong>{p.name}</strong> — ${parseFloat(p.price).toFixed(2)}
                <button type="button" onClick={() => deleteProduct(idx)}>❌</button>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : '💾 Save Profile'}
        </button>
      </form>
    </div>
  );
}
