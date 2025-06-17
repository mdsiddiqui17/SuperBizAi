// client/src/modules/ProductiveSpace/pages/RemindersPage.js
import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../services/productiveSpaceApi';
import ReminderForm from '../components/ReminderForm';
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

const RemindersPage = () => {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

  const [statusFilter, setStatusFilter] = useState(''); // '', 'pending', 'completed', 'snoozed'
  // Add date range filters if needed: const [remindAfterFilter, setRemindAfterFilter] = useState('');

  const fetchReminders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      // if (remindAfterFilter) params.remindAfter = remindAfterFilter;

      const response = await api.getReminders(params);
      setReminders(response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch reminders.';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Fetch reminders error:", errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter /*, remindAfterFilter */]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleOpenCreateModal = () => {
    setEditingReminder(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (reminder) => {
    setEditingReminder(reminder);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReminder(null);
  };

  const handleSubmitReminderForm = async (reminderData) => {
    setIsLoading(true);
    try {
      if (editingReminder && editingReminder._id) {
        await api.updateReminder(editingReminder._id, reminderData);
        toast.success('Reminder updated successfully!');
        // alert('Reminder updated successfully!');
      } else {
        await api.createReminder(reminderData);
        toast.success('Reminder created successfully!');
        // alert('Reminder created successfully!');
      }
      handleCloseModal();
      fetchReminders();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || (editingReminder ? 'Failed to update reminder.' : 'Failed to create reminder.');
      setError(errorMsg);
      toast.error(errorMsg);
      // alert(errorMsg);
      console.error("Submit reminder error:", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReminder = async (reminderId) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        await api.deleteReminder(reminderId);
        toast.success('Reminder deleted successfully!');
        // alert('Reminder deleted successfully!');
        fetchReminders();
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to delete reminder.';
        setError(errorMsg);
        toast.error(errorMsg);
        // alert(errorMsg);
        console.error("Delete reminder error:", errorMsg);
      }
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'completed': return 'success';
      case 'snoozed': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Reminders</h2>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          Create New Reminder
        </button>
      </div>

      {/* Filter UI */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label htmlFor="statusFilter" className="form-label">Filter by Status</label>
          <select id="statusFilter" className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="snoozed">Snoozed</option>
          </select>
        </div>
        {/* Add date range filters here if desired */}
      </div>

      {isLoading && <p>Loading reminders...</p>}
      {error && <div className="alert alert-danger" role="alert">Error: {error}</div>}

      {!isLoading && !error && reminders.length === 0 && (
        <div className="text-center p-5 border rounded bg-light">
            <h4>No reminders found.</h4>
            <p>Set up some reminders to stay on track!</p>
        </div>
      )}

      {!isLoading && !error && reminders.length > 0 && (
        <div className="list-group">
          {reminders.map(reminder => (
            <div key={reminder._id} className="list-group-item list-group-item-action flex-column align-items-start mb-2 shadow-sm">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{reminder.message}</h5>
                <small>Status: <span className={`badge bg-${getStatusBadgeColor(reminder.status)}`}>{reminder.status}</span></small>
              </div>
              <p className="mb-1">
                Remind At: <strong>{formatDateTime(reminder.remindAt)}</strong>
                {reminder.isRecurring && <span className="ms-2 badge bg-info text-dark">Recurring {reminder.recurrenceRule ? `(${reminder.recurrenceRule})` : ''}</span>}
              </p>
              <div className="mt-2">
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOpenEditModal(reminder)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteReminder(reminder._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingReminder ? 'Edit Reminder' : 'Create New Reminder'}>
        <ReminderForm
          onSubmit={handleSubmitReminderForm}
          onCancel={handleCloseModal}
          initialReminderData={editingReminder}
          isEditMode={!!editingReminder}
        />
      </Modal>
    </div>
  );
};

export default RemindersPage;
