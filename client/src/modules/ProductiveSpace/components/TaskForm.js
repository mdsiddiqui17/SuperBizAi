// client/src/modules/ProductiveSpace/components/TaskForm.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const TaskForm = ({ onSubmit, onCancel, initialTaskData, isEditMode }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    if (isEditMode && initialTaskData) {
      setTask({
        title: initialTaskData.title || '',
        description: initialTaskData.description || '',
        status: initialTaskData.status || 'todo',
        priority: initialTaskData.priority || 'medium',
        dueDate: initialTaskData.dueDate ? new Date(initialTaskData.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      // Reset for create mode or if no initial data
      setTask({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' });
    }
  }, [isEditMode, initialTaskData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.title.trim()) {
      toast.error('Title is required.'); // New line
      return;
    }
    const taskDataToSubmit = { ...task };
    if (!taskDataToSubmit.dueDate) { // Handle empty dueDate string
        delete taskDataToSubmit.dueDate; // Remove if empty to allow Mongoose default or null
    }
    onSubmit(taskDataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title</label>
        <input type="text" className="form-control" id="title" name="title" value={task.title} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea className="form-control" id="description" name="description" value={task.description} onChange={handleChange}></textarea>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <select className="form-select" id="status" name="status" value={task.status} onChange={handleChange}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="priority" className="form-label">Priority</label>
          <select className="form-select" id="priority" name="priority" value={task.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="dueDate" className="form-label">Due Date</label>
        <input type="date" className="form-control" id="dueDate" name="dueDate" value={task.dueDate} onChange={handleChange} />
      </div>
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{isEditMode ? 'Update Task' : 'Create Task'}</button>
      </div>
    </form>
  );
};

export default TaskForm;
