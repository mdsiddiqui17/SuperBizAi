import React, { useState } from 'react';

const SmartFormBuilder = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([]);

  const addField = () => {
    setFields([...fields, { label: '', type: 'text' }]);
  };

  const handleSubmit = () => {
    onSave({ title, description, fields });
    setTitle('');
    setDescription('');
    setFields([]);
  };

  return (
    <div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Form Title" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <button onClick={addField}>Add Field</button>
      {fields.map((field, i) => (
        <div key={i}>
          <input
            placeholder="Field Label"
            value={field.label}
            onChange={(e) => {
              const updated = [...fields];
              updated[i].label = e.target.value;
              setFields(updated);
            }}
          />
          <select
            value={field.type}
            onChange={(e) => {
              const updated = [...fields];
              updated[i].type = e.target.value;
              setFields(updated);
            }}
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="textarea">Textarea</option>
          </select>
        </div>
      ))}
      <button onClick={handleSubmit}>Save Form</button>
    </div>
  );
};

export default SmartFormBuilder;