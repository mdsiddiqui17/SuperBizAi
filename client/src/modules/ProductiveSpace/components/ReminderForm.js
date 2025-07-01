// client/src/modules/ProductiveSpace/components/ReminderForm.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ReminderForm = ({ onSubmit, onCancel, initialReminderData, isEditMode }) => {
  const [reminder, setReminder] = useState({
    message: '',
    remindAt: '', // Will be ISO string or similar for datetime-local input
    isRecurring: false,
    recurrenceRule: '', // e.g., "FREQ=WEEKLY;BYDAY=MO" or simple text "Daily"
    status: 'pending',
  });

  useEffect(() => {
    if (isEditMode && initialReminderData) {
      // Format remindAt for datetime-local input: YYYY-MM-DDTHH:mm
      const formattedRemindAt = initialReminderData.remindAt
        ? new Date(new Date(initialReminderData.remindAt).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
        : '';

      setReminder({
        message: initialReminderData.message || '',
        remindAt: formattedRemindAt,
        isRecurring: initialReminderData.isRecurring || false,
        recurrenceRule: initialReminderData.recurrenceRule || '',
        status: initialReminderData.status || 'pending',
      });
    } else {
      // Default for new reminder - perhaps set remindAt to a future time
      const defaultDateTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      const formattedDefaultRemindAt = new Date(defaultDateTime.getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      setReminder({
        message: '',
        remindAt: formattedDefaultRemindAt,
        isRecurring: false,
        recurrenceRule: '',
        status: 'pending'
      });
    }
  }, [isEditMode, initialReminderData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReminder(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reminder.message.trim()) {
      toast.error('Message is required.');
      return;
    }
    if (!reminder.remindAt) {
      toast.error('Reminder date and time are required.');
      return;
    }
    // Convert local datetime string back to a Date object or ISO string for backend
    const submissionData = {
      ...reminder,
      remindAt: new Date(reminder.remindAt).toISOString(),
    };
    if (!submissionData.isRecurring) { // If not recurring, clear recurrenceRule
        submissionData.recurrenceRule = '';
    }
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="message" className="form-label">Message</label>
        <input type="text" className="form-control" id="message" name="message" value={reminder.message} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label htmlFor="remindAt" className="form-label">Remind At (Date & Time)</label>
        <input type="datetime-local" className="form-control" id="remindAt" name="remindAt" value={reminder.remindAt} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label htmlFor="status" className="form-label">Status</label>
        <select className="form-select" id="status" name="status" value={reminder.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="snoozed">Snoozed</option>
        </select>
      </div>
      <div className="form-check mb-3">
        <input className="form-check-input" type="checkbox" id="isRecurring" name="isRecurring" checked={reminder.isRecurring} onChange={handleChange} />
        <label className="form-check-label" htmlFor="isRecurring">
          Is Recurring?
        </label>
      </div>
      {reminder.isRecurring && (
        <div className="mb-3">
          <label htmlFor="recurrenceRule" className="form-label">Recurrence Rule (e.g., "Daily", "FREQ=WEEKLY;BYDAY=MO")</label>
          <input type="text" className="form-control" id="recurrenceRule" name="recurrenceRule" value={reminder.recurrenceRule} onChange={handleChange} placeholder="Describe recurrence or use RRULE"/>
        </div>
      )}
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{isEditMode ? 'Update Reminder' : 'Create Reminder'}</button>
      </div>
    </form>
  );
};

export default ReminderForm;
