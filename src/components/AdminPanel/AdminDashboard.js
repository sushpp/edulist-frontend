import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/admin';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import './AdminPanel.css';

const AdminDashboard = () => {
  // Initialize analytics safely
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalInstitutes: 0,
    pendingInstitutes: 0,
    totalReviews: 0,
  });

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

  const fetchDashboardData = async () => {
    try {
      const response = await adminService.getDashboardAnalytics();

      // Safe access with optional chaining and fallback
      const analyticsData = response?.analytics ?? {};
      setAnalytics({
        totalUsers: analyticsData.totalUsers ?? 0,
        totalInstitutes: analyticsData.totalInstitutes ?? 0,
        pendingInstitutes: analyticsData.pendingInstitutes ?? 0,
        totalReviews: analyticsData.totalReviews ?? 0,
      });

      const activitiesData = response?.recentActivities ?? {};
      setRecentActivities({
        newUsers: Array.isArray(activitiesData.newUsers) ? activitiesData.newUsers : [],
        pendingInstitutes: Array.isArray(activitiesData.pendingInstitutes)
          ? activitiesData.pendingInstitutes
          : [],
        recentReviews: Array.isArray(activitiesData.recentReviews)
          ? activitiesData.recentReviews
          : [],
      });
    } catch (error) {
      console.error('❌ Dashboard fetch error:', error);

      // Reset to safe defaults
      setAnalytics({
        totalUsers: 0,
        totalInstitutes: 0,
        pendingInstitutes: 0,
        totalReviews: 0,
      });
      setRecentActivities({
        newUsers: [],
        pendingInstitutes: [],
        recentReviews: [],
      });
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
                <h3>{analytics?.totalUsers ?? 0}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="analytics-card">
              <div className="card-icon institutes">🏫</div>
              <div className="card-content">
                <h3>{analytics?.totalInstitutes ?? 0}</h3>
                <p>Approved Institutes</p>
              </div>
            </div>
            <div className="analytics-card">
              <div className="card-icon pending">⏳</div>
              <div className="card-content">
                <h3>{analytics?.pendingInstitutes ?? 0}</h3>
                <p>Pending Institutes</p>
              </div>
            </div>
            <div className="analytics-card">
              <div className="card-icon reviews">⭐</div>
              <div className="card-content">
                <h3>{analytics?.totalReviews ?? 0}</h3>
                <p>Total Reviews</p>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          {['newUsers', 'pendingInstitutes', 'recentReviews'].map((key) => (
            <div key={key} className="activity-section">
              <h3>{key.replace(/([A-Z])/g, ' $1')}</h3>
              <div className="activity-list">
                {Array.isArray(recentActivities[key]) && recentActivities[key].length > 0 ? (
                  recentActivities[key].map((item) => (
                    <div key={item._id} className="activity-item">
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
                  ))
                ) : (
                  <p>No {key.replace(/([A-Z])/g, ' ').toLowerCase()}</p>
                )}
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
