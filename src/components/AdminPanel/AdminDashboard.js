import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/admin';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import './AdminPanel.css';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalInstitutes: 0,
    pendingInstitutes: 0,
    totalReviews: 0,
    totalEnquiries: 0,
    totalCourses: 0,
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

  const safeGet = (obj, path, fallback) => {
    try {
      return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj) ?? fallback;
    } catch {
      return fallback;
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await adminService.getDashboardAnalytics();
      console.log("📊 Raw Dashboard API:", response);

      const safeAnalytics = safeGet(response, 'analytics', {});
      const safeActivities = safeGet(response, 'recentActivities', {});

      setAnalytics({
        totalUsers: safeAnalytics.totalUsers ?? 0,
        totalInstitutes: safeAnalytics.totalInstitutes ?? 0,
        pendingInstitutes: safeAnalytics.pendingInstitutes ?? 0,
        totalReviews: safeAnalytics.totalReviews ?? 0,
        totalEnquiries: safeAnalytics.totalEnquiries ?? 0,
        totalCourses: safeAnalytics.totalCourses ?? 0,
      });

      setRecentActivities({
        newUsers: Array.isArray(safeActivities.newUsers) ? safeActivities.newUsers : [],
        pendingInstitutes: Array.isArray(safeActivities.pendingInstitutes)
          ? safeActivities.pendingInstitutes
          : [],
        recentReviews: Array.isArray(safeActivities.recentReviews)
          ? safeActivities.recentReviews
          : [],
      });

    } catch (error) {
      console.error("❌ Dashboard fetch error:", error);

      setAnalytics({
        totalUsers: 0,
        totalInstitutes: 0,
        pendingInstitutes: 0,
        totalReviews: 0,
        totalEnquiries: 0,
        totalCourses: 0,
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
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <h1>Admin Dashboard</h1>

          <div className="user-info">
            <span>Welcome, {user?.name || 'Admin'}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="admin-dashboard">

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

              <div className="analytics-card">
                <div className="card-icon enquiries">📧</div>
                <div className="card-content">
                  <h3>{analytics.totalEnquiries}</h3>
                  <p>Total Enquiries</p>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon courses">📚</div>
                <div className="card-content">
                  <h3>{analytics.totalCourses}</h3>
                  <p>Total Courses</p>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="recent-activities">
              <div className="activity-section">
                <h3>New Users</h3>
                <div className="activity-list">
                  {recentActivities.newUsers.length > 0 ? (
                    recentActivities.newUsers.map((u) => (
                      <div key={u._id} className="activity-item">
                        <div className="activity-avatar">{u.name?.charAt(0) || 'U'}</div>
                        <div className="activity-details">
                          <p><strong>{u.name}</strong> registered</p>
                          <small>{new Date(u.createdAt).toLocaleDateString()}</small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No new users</p>
                  )}
                </div>
              </div>

              <div className="activity-section">
                <h3>Pending Institutes</h3>
                <div className="activity-list">
                  {recentActivities.pendingInstitutes.length > 0 ? (
                    recentActivities.pendingInstitutes.map((i) => (
                      <div key={i._id} className="activity-item">
                        <div className="activity-avatar">{i.name?.charAt(0) || 'I'}</div>
                        <div className="activity-details">
                          <p><strong>{i.name}</strong> waiting approval</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No pending institutes</p>
                  )}
                </div>
              </div>

              <div className="activity-section">
                <h3>Recent Reviews</h3>
                <div className="activity-list">
                  {recentActivities.recentReviews.length > 0 ? (
                    recentActivities.recentReviews.map((r) => (
                      <div key={r._id} className="activity-item">
                        <div className="activity-avatar">{r.user?.name?.charAt(0) || 'U'}</div>
                        <div className="activity-details">
                          <p>
                            <strong>{r.user?.name}</strong> reviewed 
                            <strong> {r.institute?.name}</strong>
                          </p>
                          <div>{'⭐'.repeat(r.rating || 0)}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No recent reviews</p>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
