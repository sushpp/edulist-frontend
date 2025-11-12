import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

const DebugAuth = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  return (
    <div style={{ 
      background: '#f8f9fa', 
      padding: '20px', 
      border: '2px solid #e74c3c',
      margin: '10px',
      borderRadius: '8px'
    }}>
      <h3>🔧 Debug Information</h3>
      <p><strong>Current Path:</strong> {location.pathname}</p>
      <p><strong>User:</strong> {user ? JSON.stringify(user) : 'No user'}</p>
      <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
      <p><strong>User Role:</strong> {user?.role || 'No role'}</p>
      <p><strong>Protected Route Access:</strong> {user ? 'Allowed' : 'Blocked'}</p>
    </div>
  );
};

export default DebugAuth;