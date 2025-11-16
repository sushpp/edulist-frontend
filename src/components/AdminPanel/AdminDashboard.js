import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDashboardAnalytics();

      // Safe defaults
      const data = response?.analytics || {};
      setAnalytics({
        totalUsers: data.totalUsers || 0,
        totalInstitutes: data.totalInstitutes || 0,
        pendingInstitutes: data.pendingInstitutes || 0,
        totalReviews: data.totalReviews || 0,
        totalEnquiries: data.totalEnquiries || 0,
        totalCourses: data.totalCourses || 0,
      });

      const activities = response?.recentActivities || {};
      setRecentActivities({
        newUsers: Array.isArray(activities.newUsers) ? activities.newUsers : [],
        pendingInstitutes: Array.isArray(activities.pendingInstitutes) ? activities.pendingInstitutes : [],
        recentReviews: Array.isArray(activities.recentReviews) ? activities.recentReviews : [],
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
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
          <div className="analytics-grid">
            <div className="analytics-card"><h3>{analytics.totalUsers}</h3><p>Total Users</p></div>
            <div className="analytics-card"><h3>{analytics.totalInstitutes}</h3><p>Approved Institutes</p></div>
            <div className="analytics-card"><h3>{analytics.pendingInstitutes}</h3><p>Pending Institutes</p></div>
            <div className="analytics-card"><h3>{analytics.totalReviews}</h3><p>Total Reviews</p></div>
            <div className="analytics-card"><h3>{analytics.totalEnquiries}</h3><p>Total Enquiries</p></div>
            <div className="analytics-card"><h3>{analytics.totalCourses}</h3><p>Total Courses</p></div>
          </div>

          {/* Recent Activities */}
          <div className="recent-activities">
            {['newUsers', 'pendingInstitutes', 'recentReviews'].map(section => (
              <div key={section} className="activity-section">
                <h3>{section === 'newUsers' ? 'New Users' : section === 'pendingInstitutes' ? 'Pending Institutes' : 'Recent Reviews'}</h3>
                <div className="activity-list">
                  {recentActivities[section]?.length > 0 ? (
                    recentActivities[section].map(item => (
                      <div key={item._id} className="activity-item">
                        <div className="activity-avatar">{item.name?.charAt(0) || 'U'}</div>
                        <div className="activity-details">
                          {section === 'newUsers' && <p><strong>{item.name}</strong> registered</p>}
                          {section === 'pendingInstitutes' && <p><strong>{item.name}</strong> waiting approval</p>}
                          {section === 'recentReviews' && <p><strong>{item.user?.name}</strong> reviewed <strong>{item.institute?.name}</strong> ⭐{item.rating || 0}</p>}
                          <small>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</small>
                        </div>
                      </div>
                    ))
                  ) : (<p>No {section === 'newUsers' ? 'new users' : section === 'pendingInstitutes' ? 'pending institutes' : 'recent reviews'}</p>)}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
