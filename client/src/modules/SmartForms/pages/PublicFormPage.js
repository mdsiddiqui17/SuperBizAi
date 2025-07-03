import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/SmartForms.css';

const PublicFormPage = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios.get(`/api/forms/public/${formId}`)
      .then((res) => setForm(res.data))
      .catch((err) => console.error('Error loading form:', err));
  }, [formId]);

  const handleChange = (label, value) => {
    setAnswers((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formatted = Object.entries(answers).map(([label, value]) => ({ label, value }));
    try {
      await axios.post(`/api/forms/submit/${formId}`, { answers: formatted });
      setSubmitted(true);
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  if (!form) return <div>Loading...</div>;
  if (submitted) return <div className="public-form-thankyou">✅ Thanks for submitting the form!</div>;

  return (
    <div className="public-form-page">
      <h2>{form.title}</h2>
      <p>{form.description}</p>
      <form onSubmit={handleSubmit}>
        {form.fields.map((field, idx) => (
          <div key={idx} className="field-row">
            <label>
              {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                required={field.required}
                onChange={(e) => handleChange(field.label, e.target.value)}
              />
            ) : (
              <input
                type={field.type}
                required={field.required}
                onChange={(e) => handleChange(field.label, e.target.value)}
              />
            )}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PublicFormPage;