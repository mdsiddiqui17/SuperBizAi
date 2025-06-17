// client/src/modules/ProductiveSpace/pages/WorkspaceLinksPage.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '../services/productiveSpaceApi';
import WorkspaceLinkForm from '../components/WorkspaceLinkForm';
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

const WorkspaceLinksPage = () => {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  const [categoryFilter, setCategoryFilter] = useState(''); // Empty string for 'All'

  const fetchLinks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (categoryFilter) params.category = categoryFilter;

      const response = await api.getWorkspaceLinks(params);
      setLinks(response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch workspace links.';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Fetch links error:", errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleOpenCreateModal = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (link) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
  };

  const handleSubmitLinkForm = async (linkData) => {
    setIsLoading(true);
    try {
      if (editingLink && editingLink._id) {
        await api.updateWorkspaceLink(editingLink._id, linkData);
        toast.success('Link updated successfully!');
        // alert('Link updated successfully!');
      } else {
        await api.createWorkspaceLink(linkData);
        toast.success('Link created successfully!');
        // alert('Link created successfully!');
      }
      handleCloseModal();
      fetchLinks();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || (editingLink ? 'Failed to update link.' : 'Failed to create link.');
      setError(errorMsg);
      toast.error(errorMsg);
      // alert(errorMsg);
      console.error("Submit link error:", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        await api.deleteWorkspaceLink(linkId);
        toast.success('Link deleted successfully!');
        // alert('Link deleted successfully!');
        fetchLinks();
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to delete link.';
        setError(errorMsg);
        toast.error(errorMsg);
        // alert(errorMsg);
        console.error("Delete link error:", errorMsg);
      }
    }
  };

  const groupedLinks = useMemo(() => {
    if (!links) return {};
    return links.reduce((acc, link) => {
      const category = link.category || 'General';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(link);
      return acc;
    }, {});
  }, [links]);

  const uniqueCategories = useMemo(() => {
    if (!links) return ['All'];
    const cats = new Set(links.map(link => link.category || 'General'));
    return ['All', ...Array.from(cats).sort()];
  }, [links]);


  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Workspace Links</h2>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          Add New Link
        </button>
      </div>

      {/* Filter UI */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label htmlFor="categoryFilter" className="form-label">Filter by Category</label>
          <select id="categoryFilter" className="form-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            {uniqueCategories.map(cat => <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {isLoading && <p>Loading links...</p>}
      {error && <div className="alert alert-danger" role="alert">Error: {error}</div>}

      {!isLoading && !error && links.length === 0 && (
        <div className="text-center p-5 border rounded bg-light">
            <h4>No workspace links found.</h4>
            <p>Add some useful links to get started!</p>
        </div>
      )}

      {!isLoading && !error && Object.keys(groupedLinks).length > 0 && (
        Object.entries(groupedLinks).map(([category, linksInCategory]) => (
          <div key={category} className="mb-4">
            <h4>{category}</h4>
            <div className="list-group">
              {linksInCategory.map(link => (
                <div key={link._id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                  <div>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="fw-bold">
                      {link.icon && <i className={`${link.icon} me-2`}></i> /* Assuming Font Awesome or similar */}
                      {link.name}
                    </a>
                    <small className="d-block text-muted">{link.url}</small>
                  </div>
                  <div>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOpenEditModal(link)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteLink(link._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingLink ? 'Edit Link' : 'Add New Link'}>
        <WorkspaceLinkForm
          onSubmit={handleSubmitLinkForm}
          onCancel={handleCloseModal}
          initialLinkData={editingLink}
          isEditMode={!!editingLink}
        />
      </Modal>
    </div>
  );
};

export default WorkspaceLinksPage;
