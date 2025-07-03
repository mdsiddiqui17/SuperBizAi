import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const user = localStorage.getItem('user');
  const isLoggedIn = !!user;
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      {isLoggedIn ? (
        <div className="footer-inner">
          <div className="footer-section">
            <h4>Support</h4>
            <Link to="/support">Contact Support</Link>
            <Link to="/report">Report a Bug</Link>
            <Link to="/status">System Status</Link>
          </div>
          <div className="footer-section">
            <h4>Settings</h4>
            <Link to="/account">Account Settings</Link>
            <Link to="/privacy">Privacy Settings</Link>
          </div>
          <div className="footer-section">
            <h4>Feedback</h4>
            <p>Have suggestions? We'd love to hear from you.</p>
          </div>
        </div>
      ) : (
        <div className="footer-inner">
          <div className="footer-section">
            <img src="/Logo.png" alt="SuperBiz AI" className="footer-logo" />
            <p>Powering Small Businesses with AI</p>
          </div>
          <div className="footer-section">
            <h4>Explore</h4>
            <Link to="/about">About Us</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
          </div>
        </div>
      )}
      <div className="footer-bottom">
        <span>© {year} SuperBiz AI. All rights reserved.</span>
        <span className="version">v1.0.0</span>
      </div>
    </footer>
  );
}
