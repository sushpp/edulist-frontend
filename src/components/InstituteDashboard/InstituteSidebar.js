import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const InstituteSidebar = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/institute/dashboard/profile', icon: '🏫', label: 'Profile' },
    { path: '/institute/dashboard/courses', icon: '📚', label: 'Courses' },
    { path: '/institute/dashboard/facilities', icon: '🏢', label: 'Facilities' },
    { path: '/institute/dashboard/enquiries', icon: '📧', label: 'Enquiries' },
    { path: '/institute/dashboard/reviews', icon: '⭐', label: 'Reviews' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <div className={`institute-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Institute Panel</h3>
          <button className="close-sidebar" onClick={onClose}>×</button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={onLogout} className="logout-btn">
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default InstituteSidebar;