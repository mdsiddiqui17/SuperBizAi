// client/src/modules/ProductiveSpace/components/WorkspaceLinkForm.js
import React, { useState, useEffect } from 'react';

const WorkspaceLinkForm = ({ onSubmit, onCancel, initialLinkData, isEditMode }) => {
  const [link, setLink] = useState({
    name: '',
    url: '',
    category: 'General', // Default category
    icon: '', // e.g., Font Awesome class or emoji
  });

  useEffect(() => {
    if (isEditMode && initialLinkData) {
      setLink({
        name: initialLinkData.name || '',
        url: initialLinkData.url || '',
        category: initialLinkData.category || 'General',
        icon: initialLinkData.icon || '',
      });
    } else {
      setLink({ name: '', url: '', category: 'General', icon: '' });
    }
  }, [isEditMode, initialLinkData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLink(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!link.name.trim() || !link.url.trim()) {
      alert('Name and URL are required.');
      return;
    }
    // Basic URL validation (optional, as schema also has it)
    try {
        new URL(link.url); // Check if URL is constructible
    } catch (_) {
        alert('Please enter a valid URL (e.g., https://example.com)');
        return;
    }
    onSubmit(link);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name</label>
        <input type="text" className="form-control" id="name" name="name" value={link.name} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label htmlFor="url" className="form-label">URL</label>
        <input type="url" className="form-control" id="url" name="url" value={link.url} onChange={handleChange} placeholder="https://example.com" required />
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <input type="text" className="form-control" id="category" name="category" value={link.category} onChange={handleChange} placeholder="e.g., Work, Tools, Docs"/>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="icon" className="form-label">Icon (Optional)</label>
          <input type="text" className="form-control" id="icon" name="icon" value={link.icon} onChange={handleChange} placeholder="e.g., fas fa-book or emoji ✨"/>
        </div>
      </div>
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{isEditMode ? 'Update Link' : 'Create Link'}</button>
      </div>
    </form>
  );
};

export default WorkspaceLinkForm;
