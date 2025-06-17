// client/src/modules/ProductiveSpace/pages/TasksPage.js
import React, { useState, useEffect, useCallback } from 'react';
import * as api from '../services/productiveSpaceApi'; // Assuming API service is here
import TaskForm from '../components/TaskForm'; // Assuming TaskForm is in components
import { toast } from 'react-toastify'; // If you have toastify setup

// Basic Modal Component (can be extracted to its own file later)
const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
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

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null for create, task object for edit

  // Filters state
  const [statusFilter, setStatusFilter] = useState(''); // '', 'todo', 'in-progress', 'done'
  const [priorityFilter, setPriorityFilter] = useState(''); // '', 'low', 'medium', 'high'

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      // Add other filters like dueDate or sortBy if UI elements are added for them

      const response = await api.getTasks(params);
      setTasks(response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch tasks.';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Fetch tasks error:", errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, priorityFilter]); // Refetch when filters change

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmitTaskForm = async (taskData) => {
    setIsLoading(true); // Potentially a different loading state for form submission
    try {
      if (editingTask && editingTask._id) {
        await api.updateTask(editingTask._id, taskData);
        toast.success('Task updated successfully!');
        // alert('Task updated successfully!');
      } else {
        await api.createTask(taskData);
        toast.success('Task created successfully!');
        // alert('Task created successfully!');
      }
      handleCloseModal();
      fetchTasks(); // Refetch tasks after create/update
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || (editingTask ? 'Failed to update task.' : 'Failed to create task.');
      setError(errorMsg); // Show error related to form submission
      toast.error(errorMsg);
      // alert(errorMsg); // Fallback alert
      console.error("Submit task error:", errorMsg);
    } finally {
      setIsLoading(false); // Reset general loading state
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.deleteTask(taskId);
        toast.success('Task deleted successfully!');
        // alert('Task deleted successfully!');
        fetchTasks(); // Refetch tasks
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to delete task.';
        setError(errorMsg);
        toast.error(errorMsg);
        // alert(errorMsg);
        console.error("Delete task error:", errorMsg);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mt-4">
      <h2>Tasks</h2>
      <button className="btn btn-primary mb-3" onClick={handleOpenCreateModal}>
        Create New Task
      </button>

      {/* Filter UI */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label htmlFor="statusFilter" className="form-label">Status</label>
          <select id="statusFilter" className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="priorityFilter" className="form-label">Priority</label>
          <select id="priorityFilter" className="form-select" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {isLoading && <p>Loading tasks...</p>}
      {error && <div className="alert alert-danger" role="alert">Error: {error}</div>}

      {!isLoading && !error && tasks.length === 0 && (
        <p>No tasks found. Create one!</p>
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <div className="list-group">
          {tasks.map(task => (
            <div key={task._id} className="list-group-item list-group-item-action flex-column align-items-start mb-2 shadow-sm">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{task.title}</h5>
                <small>Due: {formatDate(task.dueDate)}</small>
              </div>
              <p className="mb-1">{task.description || 'No description.'}</p>
              <small>Status: <span className={`badge bg-${task.status === 'done' ? 'success' : task.status === 'in-progress' ? 'warning' : 'secondary'}`}>{task.status}</span></small>
              <small className="ms-2">Priority: <span className={`badge bg-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'info' : 'light text-dark'}`}>{task.priority}</span></small>
              <div className="mt-2">
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOpenEditModal(task)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTask(task._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTask ? 'Edit Task' : 'Create New Task'}>
        <TaskForm
          onSubmit={handleSubmitTaskForm}
          onCancel={handleCloseModal}
          initialTaskData={editingTask}
          isEditMode={!!editingTask}
        />
      </Modal>
    </div>
  );
};

export default TasksPage;
