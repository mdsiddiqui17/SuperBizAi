// client/src/modules/ProductiveSpace/components/ProductiveSpaceNav.js
import React from 'react';
import { NavLink } from 'react-router-dom'; // Using NavLink for active styling

const ProductiveSpaceNav = () => {
  const navItemStyle = {
    marginRight: '15px',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
  };

  const activeStyle = {
    fontWeight: 'bold',
    backgroundColor: '#e9ecef', // A light background for active link
    color: '#0d6efd', // Bootstrap primary color
  };

  return (
    <nav className="nav nav-pills flex-column flex-sm-row mb-3">
      <NavLink
        to="/productive-space/tasks"
        style={({ isActive }) => ({ ...navItemStyle, ...(isActive ? activeStyle : {}) })}
        className="nav-link" // Bootstrap class for styling consistency
      >
        Tasks
      </NavLink>
      <NavLink
        to="/productive-space/notes"
        style={({ isActive }) => ({ ...navItemStyle, ...(isActive ? activeStyle : {}) })}
        className="nav-link"
      >
        Notes
      </NavLink>
      <NavLink
        to="/productive-space/reminders"
        style={({ isActive }) => ({ ...navItemStyle, ...(isActive ? activeStyle : {}) })}
        className="nav-link"
      >
        Reminders
      </NavLink>
      <NavLink
        to="/productive-space/crm"
        style={({ isActive }) => ({ ...navItemStyle, ...(isActive ? activeStyle : {}) })}
        className="nav-link"
      >
        CRM Contacts
      </NavLink>
      <NavLink
        to="/productive-space/links"
        style={({ isActive }) => ({ ...navItemStyle, ...(isActive ? activeStyle : {}) })}
        className="nav-link"
      >
        Workspace Links
      </NavLink>
      {/* Add NavLink for TemplatesPage when it's ready */}
    </nav>
  );
};

export default ProductiveSpaceNav;
