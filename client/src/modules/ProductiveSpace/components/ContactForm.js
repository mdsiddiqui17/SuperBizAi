// client/src/modules/ProductiveSpace/components/ContactForm.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ContactForm = ({ onSubmit, onCancel, initialContactData, isEditMode }) => {
  const [contact, setContact] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    notes: '',
    tags: '', // Comma-separated string for input
  });

  useEffect(() => {
    if (isEditMode && initialContactData) {
      setContact({
        name: initialContactData.name || '',
        company: initialContactData.company || '',
        email: initialContactData.email || '',
        phone: initialContactData.phone || '',
        notes: initialContactData.notes || '',
        tags: Array.isArray(initialContactData.tags) ? initialContactData.tags.join(', ') : '',
      });
    } else {
      setContact({ name: '', company: '', email: '', phone: '', notes: '', tags: '' });
    }
  }, [isEditMode, initialContactData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contact.name.trim()) {
      toast.error('Name is required.');
      return;
    }
    // Basic email validation (optional, as schema also has it)
    if (contact.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(contact.email)) {
        toast.error('Please enter a valid email address.');
        return;
    }
    const tagsArray = contact.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    onSubmit({ ...contact, tags: tagsArray });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name</label>
        <input type="text" className="form-control" id="name" name="name" value={contact.name} onChange={handleChange} required />
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="company" className="form-label">Company</label>
          <input type="text" className="form-control" id="company" name="company" value={contact.company} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" name="email" value={contact.email} onChange={handleChange} />
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="phone" className="form-label">Phone</label>
        <input type="tel" className="form-control" id="phone" name="phone" value={contact.phone} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label htmlFor="notes" className="form-label">Notes</label>
        <textarea className="form-control" id="notes" name="notes" value={contact.notes} onChange={handleChange} rows="3"></textarea>
      </div>
      <div className="mb-3">
        <label htmlFor="tags" className="form-label">Tags (comma-separated)</label>
        <input type="text" className="form-control" id="tags" name="tags" value={contact.tags} onChange={handleChange} />
      </div>
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{isEditMode ? 'Update Contact' : 'Create Contact'}</button>
      </div>
    </form>
  );
};

export default ContactForm;
