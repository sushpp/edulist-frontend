// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/admin';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import './AdminPanel.css';

const AdminDashboard = () => {
  // --- STATE INITIALIZATION ---
  // State is initialized with safe, non-null, non-undefined defaults.
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalInstitutes: 0,
    pendingInstitutes: 0,
    totalReviews: 0,
  });

  const [featuredInstitutes, setFeaturedInstitutes] = useState([]);
  const [recentActivities, setRecentActivities] = useState({
    newUsers: [],
    pendingInstitutes: [],
    recentReviews: [],
  });

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // -------------------------------------------------------
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const response = await adminService.getDashboardAnalytics();

      // --- CRITICAL DEBUGGING ---
      // This log will show you EXACTLY what the service returned.
      console.log('✅ Service returned:', response);

      // --- ULTIMATE SAFETY CHECKS ---
      // Even though the service should be safe, we double-check here.
      // This makes the component independent and impossible to crash from bad data.
      const safeAnalytics = (response && typeof response === 'object' && response.analytics) ? response.analytics : {};
      const safeFeatured = (response && Array.isArray(response.featuredInstitutes)) ? response.featuredInstitutes : [];
      const safeActivities = (response && typeof response === 'object' && response.recentActivities) ? response.recentActivities : {};

      // --- ATOMIC STATE UPDATES ---
      // Set all state in a single, atomic update to prevent race conditions
      const newState = {
        analytics: {
          totalUsers: safeAnalytics.totalUsers ?? 0,
          totalInstitutes: safeAnalytics.totalInstitutes ?? 0,
          pendingInstitutes: safeAnalytics.pendingInstitutes ?? 0,
          totalReviews: safeAnalytics.totalReviews ?? 0,
        },
        featuredInstitutes: safeFeatured,
        recentActivities: {
          newUsers: Array.isArray(safeActivities.newUsers) ? safeActivities.newUsers : [],
          pendingInstitutes: Array.isArray(safeActivities.pendingInstitutes) ? safeActivities.pendingInstitutes : [],
          recentReviews: Array.isArray(safeActivities.recentReviews) ? safeActivities.recentReviews : [],
        },
      };

      setAnalytics(newState.analytics);
      setFeaturedInstitutes(newState.featuredInstitutes);
      setRecentActivities(newState.recentActivities);

    } catch (error) {
      console.error('❌ A critical error occurred in fetchDashboardData:', error);
      
      // In case of a total failure, reset to empty state
      const failureState = {
        analytics: { totalUsers: 0, totalInstitutes: 0, pendingInstitutes: 0, totalReviews: 0 },
        featuredInstitutes: [],
        recentActivities: { newUsers: [], pendingInstitutes: [], recentReviews: [] },
      };
      
      setAnalytics(failureState.analytics);
      setFeaturedInstitutes(failureState.featuredInstitutes);
      setRecentActivities(failureState.recentActivities);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="dashboard-main">
        <header className="dashboard-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>☰</button>
          <h1>Admin Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.name || 'Admin'}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Analytics Cards */}
          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="card-icon users">👥</div>
              <div className="card-content">
                <h3>{analytics.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="analytics-card">
              <div className="card-icon institutes">🏫</div>
              <div className="card-content">
                <h3>{analytics.totalInstitutes}</h3>
                <p>Approved Institutes</p>
              </div>
            </div>
            <div className="analytics-card">
              <div className="card-icon pending">⏳</div>
              <div className="card-content">
                <h3>{analytics.pendingInstitutes}</h3>
                <p>Pending Institutes</p>
              </div>
            </div>
            <div className="analytics-card">
              <div className="card-icon reviews">⭐</div>
              <div className="card-content">
                <h3>{analytics.totalReviews}</h3>
                <p>Total Reviews</p>
              </div>
            </div>
          </div>

          {/* Featured Institutes Section */}
          <div className="featured-section">
            <h3>Featured Institutes</h3>
            <div className="featured-grid">
              {/* ULTIMATE SAFETY CHECK */}
              {/* We check the array type RIGHT HERE, before any other logic */}
              {Array.isArray(featuredInstitutes) && featuredInstitutes.map((institute) => (
                <div key={institute._id || institute.id || Math.random().toString(36).substr(2, 9)} className="featured-card">
                  <h4>{institute.name || 'Unnamed Institute'}</h4>
                  <p>{institute.location || 'No location'}</p>
                </div>
              ))}
            </div>
            {featuredInstitutes.length === 0 && <p>No featured institutes found.</p>}
          </div>

          {/* Recent Activities */}
          {['newUsers', 'pendingInstitutes', 'recentReviews'].map((key) => (
            <div key={key} className="activity-section">
              <h3>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
              <div className="activity-list">
                {recentActivities[key].map((item) => (
                  <div key={item._id || Math.random()} className="activity-item">
                    <div className="activity-avatar">
                      {item.name?.charAt(0) || item.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="activity-details">
                      {key === 'newUsers' && (
                        <>
                          <p><strong>{item.name}</strong> registered</p>
                          <small>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</small>
                        </>
                      )}
                      {key === 'pendingInstitutes' && (
                        <p><strong>{item.name}</strong> waiting approval</p>
                      )}
                      {key === 'recentReviews' && (
                        <>
                          <p><strong>{item.user?.name}</strong> reviewed <strong>{item.institute?.name}</strong></p>
                          <div>{'⭐'.repeat(item.rating ?? 0)}</div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {recentActivities[key].length === 0 && <p>No {key.replace(/([A-Z])/g, ' ').toLowerCase()}.</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;