// client/src/modules/ProductiveSpace/templateBuilder/pages/TemplateBuilderPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../../services/productiveSpaceApi'; // Adjust path as needed
import TemplateEditor from '../components/TemplateEditor'; // Adjust path
import { toast } from 'react-toastify'; // Assuming toastify is globally available

const TemplateBuilderPage = () => {
  const { templateId } = useParams(); // For edit mode: /productive/templates/edit/:templateId
  const navigate = useNavigate();
  const isEditMode = Boolean(templateId);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('custom'); // Default to 'custom' for builder focus
  const [structure, setStructure] = useState([]); // Array of block objects

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing template data if in edit mode
  useEffect(() => {
    if (isEditMode && templateId) {
      setIsLoading(true);
      setError(null);
      api.getTemplateById(templateId)
        .then(response => {
          const template = response.data;
          setTitle(template.title);
          setType(template.type);
          setStructure(template.structure || []); // Ensure structure is an array
        })
        .catch(err => {
          console.error("Error fetching template:", err);
          const errorMsg = err.response?.data?.message || err.message || "Failed to load template data.";
          setError(errorMsg);
          toast.error(errorMsg);
        })
        .finally(() => setIsLoading(false));
    } else {
      // Default for new template (if any specific default structure is desired)
      // setStructure([{ id: `block-${Date.now()}`, type: 'paragraph', data: { text: '' } }]);
    }
  }, [templateId, isEditMode]);

  const handleStructureChange = useCallback((newStructure) => {
    setStructure(newStructure);
  }, []);

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Template title is required.');
      return;
    }
    if (!type) {
      toast.error('Template type is required.');
      return;
    }

    setIsSaving(true);
    setError(null);

    const templateData = { title, type, structure };

    try {
      if (isEditMode) {
        await api.updateTemplate(templateId, templateData);
        toast.success('Template updated successfully!');
      } else {
        await api.createTemplate(templateData);
        toast.success('Template created successfully!');
      }
      navigate('/productive/templates'); // Redirect to templates list page
    } catch (err) {
      console.error("Error saving template:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to save template.";
      setError(errorMsg); // Display error on page as well
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="container mt-4"><p>Loading template data...</p></div>;
  }

  // Separate error display for initial load error vs save error
  if (error && !isSaving) { // Show load error prominently if not currently trying to save
    return <div className="container mt-4 alert alert-danger" role="alert">Error loading template: {error}</div>;
  }

  return (
    <div className="container mt-4 template-builder-page">
      <h2>{isEditMode ? 'Edit Template' : 'Create New Template'}</h2>

      <form onSubmit={handleSaveTemplate}>
        <div className="row mb-3">
          <div className="col-md-8">
            <label htmlFor="templateTitle" className="form-label">Template Title</label>
            <input
              type="text"
              className="form-control"
              id="templateTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter template title"
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="templateType" className="form-label">Template Type</label>
            <select
              className="form-select"
              id="templateType"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              {/* <option value="note">Note</option> // Keep if you want to build note/task templates here too */}
              {/* <option value="task">Task</option> */}
              <option value="custom">Custom Block Template</option>
              {/* Add other types if this page should handle them */}
            </select>
          </div>
        </div>

        {error && isSaving && ( // Show save error specifically near save button or form
          <div className="alert alert-danger mt-2" role="alert">
            Save Error: {error}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Template Content</label>
          <TemplateEditor
            initialStructure={structure}
            onStructureChange={handleStructureChange}
          />
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={() => navigate('/productive/templates')}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSaving}
          >
            {isSaving ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Template')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemplateBuilderPage;
