import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SmartFormBuilder from '../components/SmartFormBuilder';
import FormResponses from '../components/FormResponses';
import '../../../styles/SmartForms.css';

const SmartFormsPage = () => {
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);

  useEffect(() => {
    axios.get('/api/forms/user')
      .then((res) => setForms(res.data))
      .catch((err) => console.error('Fetch failed', err));
  }, []);

  const handleSave = (form) => {
    axios.post('/api/forms/create', form)
      .then((res) => setForms([...forms, res.data]))
      .catch((err) => console.error('Save failed', err));
  };

  return (
    <div className="smart-forms-page">
      <h2>Smart Forms</h2>
      <SmartFormBuilder onSave={handleSave} />
      <hr />
      <h3>Your Forms</h3>
      {forms.map((form) => (
        <div key={form._id} onClick={() => setSelectedFormId(form._id)}>
          <h4>{form.title}</h4>
          <p>{form.description}</p>
        </div>
      ))}
      {selectedFormId && <FormResponses formId={selectedFormId} />}
    </div>
  );
};

export default SmartFormsPage;