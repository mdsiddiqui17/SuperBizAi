// client/src/modules/ProductiveSpace/pages/TemplatesPage.js
import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../services/productiveSpaceApi';
import TemplateForm from '../components/TemplateForm';
import { toast } from 'react-toastify'; // Assuming toastify is globally available if used

// Basic Modal Component (can be extracted or use a library)
const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
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

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null); // null for create, template object for edit

  const [typeFilter, setTypeFilter] = useState(''); // '', 'note', 'task', 'custom'

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (typeFilter) params.type = typeFilter;

      const response = await api.getTemplates(params);
      setTemplates(response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch templates.';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Fetch templates error:", errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleOpenCreateModal = () => {
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (template) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
  };

  const handleSubmitTemplateForm = async (templateData) => {
    setIsLoading(true);
    try {
      if (editingTemplate && editingTemplate._id) {
        await api.updateTemplate(editingTemplate._id, templateData);
        toast.success('Template updated successfully!');
        // alert('Template updated successfully!');
      } else {
        await api.createTemplate(templateData);
        toast.success('Template created successfully!');
        // alert('Template created successfully!');
      }
      handleCloseModal();
      fetchTemplates();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || (editingTemplate ? 'Failed to update template.' : 'Failed to create template.');
      setError(errorMsg);
      toast.error(errorMsg);
      // alert(errorMsg); // Fallback alert
      console.error("Submit template error:", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await api.deleteTemplate(templateId);
        toast.success('Template deleted successfully!');
        // alert('Template deleted successfully!');
        fetchTemplates();
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to delete template.';
        setError(errorMsg);
        toast.error(errorMsg);
        // alert(errorMsg);
        console.error("Delete template error:", errorMsg);
      }
    }
  };

  const handleUseTemplate = (template) => {
    console.log("Using template:", template);
    // For 'note' or 'task' types, this could navigate to the respective creation page
    // and pass template.structure or template.title as initial data.
    // e.g., navigate('/productive/notes/new', { state: { templateData: template.structure } });
    // For 'custom' type, it might open a new document based on this template.
    toast.info(`'Use Template' clicked for "${template.title}". Structure: ${JSON.stringify(template.structure, null, 2)}`);
    // alert(`'Use Template' clicked for "${template.title}". Structure: ${JSON.stringify(template.structure, null, 2)}`);
    // Actual implementation of "Use Template" will require further planning and integration.
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Templates</h2>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          Create New Template
        </button>
      </div>

      {/* Filter UI */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label htmlFor="typeFilter" className="form-label">Filter by Type</label>
          <select id="typeFilter" className="form-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            <option value="note">Note</option>
            <option value="task">Task</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {isLoading && <p>Loading templates...</p>}
      {error && <div className="alert alert-danger" role="alert">Error: {error}</div>}

      {!isLoading && !error && templates.length === 0 && (
        <div className="text-center p-5 border rounded bg-light">
            <h4>No templates found.</h4>
            <p>Create your first template to streamline your work!</p>
        </div>
      )}

      {!isLoading && !error && templates.length > 0 && (
        <div className="row">
          {templates.map(template => (
            <div key={template._id} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{template.title}</h5>
                  <p className="card-text"><span className="badge bg-info">{template.type}</span></p>
                  {/* Optionally display a snippet or summary of the structure if feasible */}
                  {/* <p className="card-text flex-grow-1 small text-muted">
                    Structure: {JSON.stringify(template.structure).substring(0, 50)}...
                  </p> */}
                  <div className="mt-auto pt-2 border-top">
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleUseTemplate(template)}>Use</button>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOpenEditModal(template)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTemplate(template._id)}>Delete</button>
                  </div>
                </div>
                <div className="card-footer text-muted" style={{fontSize: '0.8em'}}>
                    Last updated: {new Date(template.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTemplate ? 'Edit Template' : 'Create New Template'}>
        <TemplateForm
          onSubmit={handleSubmitTemplateForm}
          onCancel={handleCloseModal}
          initialTemplateData={editingTemplate}
          isEditMode={!!editingTemplate}
        />
      </Modal>
    </div>
  );
};

export default TemplatesPage;
