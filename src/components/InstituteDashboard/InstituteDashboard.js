import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import InstituteSidebar from './InstituteSidebar';
import ProfileManagement from './ProfileManagement';
import CourseManagement from './CourseManagement';
import FacilitiesManagement from './FacilitiesManagement';
import Enquiries from './Enquiries';
import Reviews from './Reviews';
import './InstituteDashboard.css';

const InstituteDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Redirect to profile if on base dashboard path
    if (location.pathname === '/institute/dashboard') {
      navigate('/institute/dashboard/profile');
    }
  }, [location, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <InstituteSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />
      
      <div className="dashboard-main">
        <header className="dashboard-header">
          <button 
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h1>Institute Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          <Routes>
            <Route path="profile" element={<ProfileManagement />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="facilities" element={<FacilitiesManagement />} />
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="reviews" element={<Reviews />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default InstituteDashboard;