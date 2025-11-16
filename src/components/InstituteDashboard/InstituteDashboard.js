import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import InstituteSidebar from './InstituteSidebar';
import ProfileManagement from './ProfileManagement';
import './InstituteDashboard.css';

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
        <button onClick={() => window.location.reload()}>Reload Page</button>
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
      <InstituteSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <button onClick={() => setSidebarOpen(true)}>☰</button>
          <h1>Institute Dashboard</h1>
        </header>

        <div className="dashboard-content">
          <Routes>
            <Route path="profile" element={<DashboardErrorBoundary><ProfileManagement /></DashboardErrorBoundary>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default InstituteDashboard;
