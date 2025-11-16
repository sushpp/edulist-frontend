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

// FIX: Add error boundary for child components
const DashboardErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      console.error('💥 Dashboard Error Boundary Caught:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="error-boundary">
        <h2>Something went wrong</h2>
        <p>There was an error loading this section. Please try refreshing the page.</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Reload Page
        </button>
      </div>
    );
  }

  return children;
};

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
          {/* FIX: Wrap each route with error boundary */}
          <Routes>
            <Route 
              path="profile" 
              element={
                <DashboardErrorBoundary>
                  <ProfileManagement />
                </DashboardErrorBoundary>
              } 
            />
            <Route 
              path="courses" 
              element={
                <DashboardErrorBoundary>
                  <CourseManagement />
                </DashboardErrorBoundary>
              } 
            />
            <Route 
              path="facilities" 
              element={
                <DashboardErrorBoundary>
                  <FacilitiesManagement />
                </DashboardErrorBoundary>
              } 
            />
            <Route 
              path="enquiries" 
              element={
                <DashboardErrorBoundary>
                  <Enquiries />
                </DashboardErrorBoundary>
              } 
            />
            <Route 
              path="reviews" 
              element={
                <DashboardErrorBoundary>
                  <Reviews />
                </DashboardErrorBoundary>
              } 
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default InstituteDashboard;