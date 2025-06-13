import axios from 'axios';

const API_BASE_URL = '/api/productive-space'; // Base URL for all productive space endpoints

// Function to get the token from localStorage
const getToken = () => localStorage.getItem('token'); // Assuming 'token' is the key

// Helper function to create an authenticated config for axios
const getAuthConfig = () => {
  const token = getToken();
  if (!token) {
    // This case should ideally be handled by routing/global state,
    // redirecting to login if no token is found when trying to access protected resources.
    // For the API service, we can throw an error or let the API call fail.
    console.error('No token found in localStorage. API calls will likely fail.');
    // throw new Error('Authentication token not found.');
    // Or return {} and let the backend handle the 401
    return {};
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// --- Task API Functions ---
export const getTasks = (params = {}) =>
  axios.get(`${API_BASE_URL}/tasks`, { ...getAuthConfig(), params });

export const createTask = (taskData) =>
  axios.post(`${API_BASE_URL}/tasks`, taskData, getAuthConfig());

export const getTaskById = (taskId) =>
  axios.get(`${API_BASE_URL}/tasks/${taskId}`, getAuthConfig());

export const updateTask = (taskId, updateData) =>
  axios.put(`${API_BASE_URL}/tasks/${taskId}`, updateData, getAuthConfig());

export const deleteTask = (taskId) =>
  axios.delete(`${API_BASE_URL}/tasks/${taskId}`, getAuthConfig());

// --- Note API Functions ---
export const getNotes = (params = {}) =>
  axios.get(`${API_BASE_URL}/notes`, { ...getAuthConfig(), params });

export const createNote = (noteData) =>
  axios.post(`${API_BASE_URL}/notes`, noteData, getAuthConfig());

export const getNoteById = (noteId) =>
  axios.get(`${API_BASE_URL}/notes/${noteId}`, getAuthConfig());

export const updateNote = (noteId, updateData) =>
  axios.put(`${API_BASE_URL}/notes/${noteId}`, updateData, getAuthConfig());

export const deleteNote = (noteId) =>
  axios.delete(`${API_BASE_URL}/notes/${noteId}`, getAuthConfig());

// --- Reminder API Functions ---
export const getReminders = (params = {}) =>
  axios.get(`${API_BASE_URL}/reminders`, { ...getAuthConfig(), params });

export const createReminder = (reminderData) =>
  axios.post(`${API_BASE_URL}/reminders`, reminderData, getAuthConfig());

export const getReminderById = (reminderId) =>
  axios.get(`${API_BASE_URL}/reminders/${reminderId}`, getAuthConfig());

export const updateReminder = (reminderId, updateData) =>
  axios.put(`${API_BASE_URL}/reminders/${reminderId}`, updateData, getAuthConfig());

export const deleteReminder = (reminderId) =>
  axios.delete(`${API_BASE_URL}/reminders/${reminderId}`, getAuthConfig());

// --- CRM Contact API Functions ---
export const getContacts = (params = {}) =>
  axios.get(`${API_BASE_URL}/crm`, { ...getAuthConfig(), params });

export const createContact = (contactData) =>
  axios.post(`${API_BASE_URL}/crm`, contactData, getAuthConfig());

export const getContactById = (contactId) =>
  axios.get(`${API_BASE_URL}/crm/${contactId}`, getAuthConfig());

export const updateContact = (contactId, updateData) =>
  axios.put(`${API_BASE_URL}/crm/${contactId}`, updateData, getAuthConfig());

export const deleteContact = (contactId) =>
  axios.delete(`${API_BASE_URL}/crm/${contactId}`, getAuthConfig());

// --- Workspace Link API Functions ---
export const getWorkspaceLinks = (params = {}) =>
  axios.get(`${API_BASE_URL}/links`, { ...getAuthConfig(), params });

export const createWorkspaceLink = (linkData) =>
  axios.post(`${API_BASE_URL}/links`, linkData, getAuthConfig());

export const getWorkspaceLinkById = (linkId) =>
  axios.get(`${API_BASE_URL}/links/${linkId}`, getAuthConfig());

export const updateWorkspaceLink = (linkId, updateData) =>
  axios.put(`${API_BASE_URL}/links/${linkId}`, updateData, getAuthConfig());

export const deleteWorkspaceLink = (linkId) =>
  axios.delete(`${API_BASE_URL}/links/${linkId}`, getAuthConfig());

// Note: Template API functions will be added later if we proceed with Template Management frontend.

// It might also be beneficial to create an Axios instance if you need more
// complex global configurations (e.g., interceptors for error handling or token refresh)
// Example of creating an instance (can replace direct axios calls above):
/*
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Then use apiClient.get('/tasks'), apiClient.post('/tasks', taskData), etc.
// This is generally a more robust way for larger applications.
// For this iteration, direct axios calls with getAuthConfig() are used for simplicity.
*/
