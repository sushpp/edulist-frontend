import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './InstituteDashboard.css';

const InstituteSidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <h2>EduList</h2>
      </div>
      
      <ul>
        <li>
          <Link 
            to="/institute/dashboard" 
            className={isActive('/institute/dashboard') ? 'active' : ''}
          >
            <i className="fas fa-tachometer-alt"></i>
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/institute/profile" 
            className={isActive('/institute/profile') ? 'active' : ''}
          >
            <i className="fas fa-user"></i>
            Profile
          </Link>
        </li>
        <li>
          <Link 
            to="/institute/courses" 
            className={isActive('/institute/courses') ? 'active' : ''}
          >
            <i className="fas fa-book"></i>
            Courses
          </Link>
        </li>
        <li>
          <Link 
            to="/institute/facilities" 
            className={isActive('/institute/facilities') ? 'active' : ''}
          >
            <i className="fas fa-building"></i>
            Facilities
          </Link>
        </li>
        <li>
          <Link 
            to="/institute/enquiries" 
            className={isActive('/institute/enquiries') ? 'active' : ''}
          >
            <i className="fas fa-envelope"></i>
            Enquiries
          </Link>
        </li>
        <li>
          <Link 
            to="/institute/reviews" 
            className={isActive('/institute/reviews') ? 'active' : ''}
          >
            <i className="fas fa-star"></i>
            Reviews
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default InstituteSidebar;