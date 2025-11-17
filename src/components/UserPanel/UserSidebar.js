import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './UserPanel.css';

const UserSidebar = () => {
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
            to="/user/dashboard" 
            className={isActive('/user/dashboard') ? 'active' : ''}
          >
            <i className="fas fa-tachometer-alt"></i>
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/institutes" 
            className={isActive('/institutes') ? 'active' : ''}
          >
            <i className="fas fa-search"></i>
            Browse Institutes
          </Link>
        </li>
        <li>
          <Link 
            to="/user/reviews" 
            className={isActive('/user/reviews') ? 'active' : ''}
          >
            <i className="fas fa-star"></i>
            My Reviews
          </Link>
        </li>
        <li>
          <Link 
            to="/user/enquiries" 
            className={isActive('/user/enquiries') ? 'active' : ''}
          >
            <i className="fas fa-envelope"></i>
            My Enquiries
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserSidebar;