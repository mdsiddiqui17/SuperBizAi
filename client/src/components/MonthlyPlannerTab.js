import React from 'react';

export default function MonthlyPlannerTab() {
  return (
    <div>
      <h4>🧠 Monthly Marketing Planner</h4>
      <form className="row gy-3 mt-3">
        <div className="col-md-6">
          <label className="form-label">Month</label>
          <select className="form-select" required>
            <option value="">Select...</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Year</label>
          <input type="number" className="form-control" placeholder="e.g., 2025" required />
        </div>
        <div className="col-12">
          <label className="form-label">Business Focus (Optional)</label>
          <textarea className="form-control" placeholder="Describe focus or events this month" rows="3" />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">Generate Ideas</button>
        </div>
      </form>
    </div>
  );
}
