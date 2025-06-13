// client/src/modules/ProductiveSpace/components/TemplateForm.js
import React, { useState, useEffect } from 'react';

const TemplateForm = ({ onSubmit, onCancel, initialTemplateData, isEditMode }) => {
  const [template, setTemplate] = useState({
    title: '',
    type: 'note', // Default type
    structure: '{}', // Default to empty JSON object string
  });

  useEffect(() => {
    if (isEditMode && initialTemplateData) {
      setTemplate({
        title: initialTemplateData.title || '',
        type: initialTemplateData.type || 'note',
        // Ensure structure is stringified for textarea, pretty print for readability
        structure: initialTemplateData.structure ? JSON.stringify(initialTemplateData.structure, null, 2) : '{}',
      });
    } else {
      // Reset for create mode
      setTemplate({ title: '', type: 'note', structure: '{}' });
    }
  }, [isEditMode, initialTemplateData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplate(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!template.title.trim()) {
      alert('Title is required.');
      return;
    }
    if (!template.type) {
      alert('Type is required.');
      return;
    }

    let parsedStructure;
    try {
      parsedStructure = JSON.parse(template.structure);
    } catch (error) {
      alert('Invalid JSON in structure field. Please provide valid JSON or an empty object {}.');
      return;
    }

    onSubmit({ ...template, structure: parsedStructure });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Template Title</label>
        <input type="text" className="form-control" id="title" name="title" value={template.title} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label htmlFor="type" className="form-label">Template Type</label>
        <select className="form-select" id="type" name="type" value={template.type} onChange={handleChange}>
          <option value="note">Note</option>
          <option value="task">Task</option>
          <option value="custom">Custom (JSON structure)</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="structure" className="form-label">
          Structure (JSON format)
        </label>
        <p className="form-text text-muted small">
          For 'note' or 'task' types, this might define default content (e.g., `{{"content": "Default note text"}}`).
          For 'custom' type, this is the main JSON defining the template blocks.
        </p>
        <textarea
          className="form-control"
          id="structure"
          name="structure"
          value={template.structure}
          onChange={handleChange}
          rows="10"
          placeholder='e.g., { "content": "My default note content..." } or [ { "type": "paragraph", "text": "Hello" } ]'
          required
        />
      </div>
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{isEditMode ? 'Update Template' : 'Create Template'}</button>
      </div>
    </form>
  );
};

export default TemplateForm;
