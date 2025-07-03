import Form from '../models/Form.js';
import FormResponse from '../models/FormResponse.js';

// Create a new form
export const createForm = async (req, res) => {
  try {
    const { title, description, fields } = req.body;
    const newForm = new Form({
      user: req.user.id,
      title,
      description,
      fields,
    });
    await newForm.save();
    res.status(201).json(newForm);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create form' });
  }
};

// Get all forms by a user
export const getUserForms = async (req, res) => {
  try {
    const forms = await Form.find({ user: req.user.id });
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
};

// Get a form by ID (for internal use, optional)
export const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch form' });
  }
};

// Delete a form
export const deleteForm = async (req, res) => {
  try {
    await Form.findByIdAndDelete(req.params.formId);
    res.status(200).json({ message: 'Form deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete form' });
  }
};

// Submit a response to a form
export const submitFormResponse = async (req, res) => {
  try {
    const { answers } = req.body;
    const newResponse = new FormResponse({
      form: req.params.formId,
      answers,
    });
    await newResponse.save();
    res.status(201).json(newResponse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit response' });
  }
};

// Get all responses for a form
export const getFormResponses = async (req, res) => {
  try {
    const responses = await FormResponse.find({ form: req.params.formId });
    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
};

// 🔥 NEW: Get public form for sharing
export const getPublicForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch public form' });
  }
};
