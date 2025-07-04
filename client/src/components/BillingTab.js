// components/AccountSettings/BillingTab.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BillingTab.css';

export default function BillingTab() {
  const [plan, setPlan] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchBillingData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/billing/info', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlan(res.data.plan);
      setInvoices(res.data.invoices);
    } catch (err) {
      console.error('Failed to load billing data');
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  return (
    <div className="billing-tab">
      <h3>Your Current Plan</h3>
      {plan ? (
        <div className="plan-card">
          <h5>{plan.name}</h5>
          <p>Price: ${plan.price}/month</p>
          <p>Status: {plan.status}</p>
        </div>
      ) : (
        <p>Loading plan details...</p>
      )}

      <button className="upgrade-btn" onClick={() => setShowModal(true)}>
        Change or Upgrade Plan
      </button>

      <h4 className="mt-4">Billing History</h4>
      <ul className="invoice-list">
        {invoices.map((invoice, idx) => (
          <li key={idx}>
            <a href={invoice.url} target="_blank" rel="noreferrer">
              {invoice.date} – {invoice.amount}
            </a>
          </li>
        ))}
      </ul>

      {/* Modal for Upgrade Plans */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Choose a Plan</h4>
            <div className="plans-grid">
              <div className="plan-option">
                <h5>Basic</h5>
                <p>$29/mo</p>
                <button>Choose</button>
              </div>
              <div className="plan-option">
                <h5>Pro</h5>
                <p>$69/mo</p>
                <button>Choose</button>
              </div>
              <div className="plan-option">
                <h5>Agency</h5>
                <p>$159/mo</p>
                <button>Choose</button>
              </div>
            </div>
            <button className="close-modal" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
