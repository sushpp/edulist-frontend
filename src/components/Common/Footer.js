import React from 'react';
import { Link } from 'react-router-dom';
import './Common.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="logo">
              <span className="logo-icon">🎓</span>
              <span className="logo-text">EduList</span>
            </div>
            <p>Find the perfect educational institute with authentic reviews and comprehensive information.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/institutes">Browse Institutes</Link></li>
              <li><Link to="/register?role=institute">Register Institute</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Categories</h4>
            <ul>
              <li><Link to="/institutes?category=school">Schools</Link></li>
              <li><Link to="/institutes?category=college">Colleges</Link></li>
              <li><Link to="/institutes?category=university">Universities</Link></li>
              <li><Link to="/institutes?category=coaching">Coaching Centers</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <ul>
              <li>📧 support@edulist.com</li>
              <li>📞 +91 9876543210</li>
              <li>📍 123 Education Street, Learning City</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 EduList. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;