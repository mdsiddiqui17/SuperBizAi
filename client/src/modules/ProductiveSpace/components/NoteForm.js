// client/src/modules/ProductiveSpace/components/NoteForm.js
import React, { useState, useEffect } from 'react';

const NoteForm = ({ onSubmit, onCancel, initialNoteData, isEditMode }) => {
  const [note, setNote] = useState({
    title: '',
    content: '',
    tags: '', // Comma-separated string for input
  });

  useEffect(() => {
    if (isEditMode && initialNoteData) {
      setNote({
        title: initialNoteData.title || '',
        content: initialNoteData.content || '',
        tags: Array.isArray(initialNoteData.tags) ? initialNoteData.tags.join(', ') : '',
      });
    } else {
      setNote({ title: '', content: '', tags: '' });
    }
  }, [isEditMode, initialNoteData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.title.trim()) {
      alert('Title is required.');
      return;
    }
    // Convert comma-separated tags string to an array of trimmed strings
    const tagsArray = note.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    onSubmit({ ...note, tags: tagsArray });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title</label>
        <input type="text" className="form-control" id="title" name="title" value={note.title} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label htmlFor="content" className="form-label">Content</label>
        <textarea className="form-control" id="content" name="content" value={note.content} onChange={handleChange} rows="5"></textarea>
        {/* For Markdown, you might add a preview or use a dedicated editor later */}
      </div>
      <div className="mb-3">
        <label htmlFor="tags" className="form-label">Tags (comma-separated)</label>
        <input type="text" className="form-control" id="tags" name="tags" value={note.tags} onChange={handleChange} />
      </div>
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{isEditMode ? 'Update Note' : 'Create Note'}</button>
      </div>
    </form>
  );
};

export default NoteForm;
