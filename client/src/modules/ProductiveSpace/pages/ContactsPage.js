// client/src/modules/ProductiveSpace/pages/ContactsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../services/productiveSpaceApi';
import ContactForm from '../components/ContactForm';
import { toast } from 'react-toastify';

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [tagsFilter, setTagsFilter] = useState(''); // Comma-separated string

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (tagsFilter) params.tags = tagsFilter;

      const response = await api.getContacts(params);
      setContacts(response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch contacts.';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Fetch contacts error:", errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, tagsFilter]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleOpenCreateModal = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const handleSubmitContactForm = async (contactData) => {
    setIsLoading(true);
    try {
      if (editingContact && editingContact._id) {
        await api.updateContact(editingContact._id, contactData);
        toast.success('Contact updated successfully!');
        // alert('Contact updated successfully!');
      } else {
        await api.createContact(contactData);
        toast.success('Contact created successfully!');
        // alert('Contact created successfully!');
      }
      handleCloseModal();
      fetchContacts();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || (editingContact ? 'Failed to update contact.' : 'Failed to create contact.');
      setError(errorMsg);
      toast.error(errorMsg);
      // alert(errorMsg);
      console.error("Submit contact error:", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await api.deleteContact(contactId);
        toast.success('Contact deleted successfully!');
        // alert('Contact deleted successfully!');
        fetchContacts();
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to delete contact.';
        setError(errorMsg);
        toast.error(errorMsg);
        // alert(errorMsg);
        console.error("Delete contact error:", errorMsg);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>CRM Contacts</h2>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          Add New Contact
        </button>
      </div>

      {/* Filter UI */}
      <div className="row mb-3 g-2">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, company, or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by tags (comma-separated)..."
            value={tagsFilter}
            onChange={e => setTagsFilter(e.target.value)}
          />
        </div>
      </div>

      {isLoading && <p>Loading contacts...</p>}
      {error && <div className="alert alert-danger" role="alert">Error: {error}</div>}

      {!isLoading && !error && contacts.length === 0 && (
        <div className="text-center p-5 border rounded bg-light">
            <h4>No contacts found.</h4>
            <p>Start building your network by adding contacts.</p>
        </div>
      )}

      {!isLoading && !error && contacts.length > 0 && (
        // Using a table for contacts might be more appropriate
        <table className="table table-hover shadow-sm">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact._id}>
                <td>{contact.name}</td>
                <td>{contact.company || '-'}</td>
                <td>{contact.email || '-'}</td>
                <td>{contact.phone || '-'}</td>
                <td>
                  {contact.tags && contact.tags.length > 0
                    ? contact.tags.map(tag => <span key={tag} className="badge bg-secondary me-1">{tag}</span>)
                    : '-'}
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOpenEditModal(contact)}>
                    <i className="fas fa-pencil-alt"></i> {/* Example using Font Awesome if available */} Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteContact(contact._id)}>
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingContact ? 'Edit Contact' : 'Add New Contact'}>
        <ContactForm
          onSubmit={handleSubmitContactForm}
          onCancel={handleCloseModal}
          initialContactData={editingContact}
          isEditMode={!!editingContact}
        />
      </Modal>
    </div>
  );
};

export default ContactsPage;
