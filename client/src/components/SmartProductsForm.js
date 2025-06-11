// src/components/SmartProductForm.js
import React, { useState } from 'react';
import axios from 'axios';

const SmartProductForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    tags: '',
    image: null,
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Saving...');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === 'image' && value) {
          formData.append('image', value);
        } else {
          formData.append(key, value);
        }
      });

      await axios.post('/api/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setStatus('✅ Product added!');
      setForm({ name: '', category: '', price: '', description: '', tags: '', image: null });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('❌ Error saving product:', err);
      setStatus('❌ Failed to save product.');
    }
  };

  return (
    <div className="smart-product-form mt-4 mb-5">
      <h4>Add New Smart Product</h4>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Name</label>
          <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Category</label>
          <input name="category" className="form-control" value={form.category} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Price</label>
          <input type="number" name="price" className="form-control" value={form.price} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea name="description" className="form-control" rows="3" value={form.description} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Tags (comma-separated)</label>
          <input name="tags" className="form-control" value={form.tags} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Image</label>
          <input type="file" name="image" className="form-control" onChange={handleFileChange} />
        </div>
        <button type="submit" className="btn btn-success">Save Product</button>
        <p className="mt-2">{status}</p>
      </form>
    </div>
  );
};

export default SmartProductForm;
