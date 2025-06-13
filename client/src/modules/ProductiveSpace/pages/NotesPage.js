// client/src/modules/ProductiveSpace/pages/NotesPage.js
import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../services/productiveSpaceApi';
import NoteForm from '../components/NoteForm';
// import { toast } from 'react-toastify';

// Basic Modal Component (can be extracted or use a library like react-bootstrap-modal)
const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered"> {/* modal-lg for more space for content */}
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

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [tagsFilter, setTagsFilter] = useState(''); // Comma-separated string

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (tagsFilter) params.tags = tagsFilter; // API expects comma-separated string for tags

      const response = await api.getNotes(params);
      setNotes(response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch notes.';
      setError(errorMsg);
      // toast.error(errorMsg);
      console.error("Fetch notes error:", errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, tagsFilter]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleOpenCreateModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const handleSubmitNoteForm = async (noteData) => {
    // No separate loading state for form submission for now, uses main isLoading
    setIsLoading(true);
    try {
      if (editingNote && editingNote._id) {
        await api.updateNote(editingNote._id, noteData);
        // toast.success('Note updated successfully!');
        alert('Note updated successfully!');
      } else {
        await api.createNote(noteData);
        // toast.success('Note created successfully!');
        alert('Note created successfully!');
      }
      handleCloseModal();
      fetchNotes();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || (editingNote ? 'Failed to update note.' : 'Failed to create note.');
      setError(errorMsg);
      // toast.error(errorMsg);
      alert(errorMsg);
      console.error("Submit note error:", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await api.deleteNote(noteId);
        // toast.success('Note deleted successfully!');
        alert('Note deleted successfully!');
        fetchNotes();
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to delete note.';
        setError(errorMsg);
        // toast.error(errorMsg);
        alert(errorMsg);
        console.error("Delete note error:", errorMsg);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Notes</h2>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          Create New Note
        </button>
      </div>

      {/* Filter UI */}
      <div className="row mb-3 g-2">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title or content..."
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
        {/*<div className="col-md-2">
          <button className="btn btn-outline-secondary w-100" onClick={fetchNotes}>Apply Filters</button>
        </div>*/}
        {/* Fetch is triggered by useEffect on filter change, so explicit apply button is optional */}
      </div>

      {isLoading && <p>Loading notes...</p>}
      {error && <div className="alert alert-danger" role="alert">Error: {error}</div>}

      {!isLoading && !error && notes.length === 0 && (
        <div className="text-center p-5 border rounded bg-light">
            <h4>No notes found.</h4>
            <p>Why not create your first one?</p>
        </div>
      )}

      {!isLoading && !error && notes.length > 0 && (
        <div className="row">
          {notes.map(note => (
            <div key={note._id} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{note.title}</h5>
                  <p className="card-text flex-grow-1" style={{whiteSpace: 'pre-wrap', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: '100px'}}>
                    {note.content || 'No content.'}
                  </p>
                  {note.tags && note.tags.length > 0 && (
                    <p className="card-text"><small className="text-muted">Tags: {note.tags.join(', ')}</small></p>
                  )}
                  <div className="mt-auto pt-2 border-top"> {/* Buttons at the bottom */}
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOpenEditModal(note)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteNote(note._id)}>Delete</button>
                  </div>
                </div>
                <div className="card-footer text-muted" style={{fontSize: '0.8em'}}>
                    Last updated: {new Date(note.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingNote ? 'Edit Note' : 'Create New Note'}>
        <NoteForm
          onSubmit={handleSubmitNoteForm}
          onCancel={handleCloseModal}
          initialNoteData={editingNote}
          isEditMode={!!editingNote}
        />
      </Modal>
    </div>
  );
};

export default NotesPage;
