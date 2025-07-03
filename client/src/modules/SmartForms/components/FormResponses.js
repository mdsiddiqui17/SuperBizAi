import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FormResponses = ({ formId }) => {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    axios.get(`/api/forms/responses/${formId}`)
      .then((res) => setResponses(res.data))
      .catch((err) => console.error('Failed to load responses', err));
  }, [formId]);

  return (
    <div>
      <h4>Form Responses</h4>
      {responses.map((resp, idx) => (
        <div key={idx}>
          {Object.entries(resp.answers).map(([key, val]) => (
            <p key={key}><strong>{key}</strong>: {val}</p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FormResponses;