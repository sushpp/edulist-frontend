import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/admin';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [recentActivities, setRecentActivities] = useState({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await adminService.getDashboardAnalytics();
      setAnalytics(data.analytics);
      setRecentActivities(data.recentActivities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <AdminSidebar 
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
          <h1>Admin Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="admin-dashboard">
            <div className="dashboard-header">
              <h1>Admin Dashboard</h1>
              <p>Welcome to EduList Administration Panel</p>
            </div>

            {/* Analytics Cards */}
            <div className="analytics-grid">
              <div className="analytics-card">
                <div className="card-icon users">👥</div>
                <div className="card-content">
                  <h3>{analytics.totalUsers || 0}</h3>
                  <p>Total Users</p>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon institutes">🏫</div>
                <div className="card-content">
                  <h3>{analytics.totalInstitutes || 0}</h3>
                  <p>Approved Institutes</p>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon pending">⏳</div>
                <div className="card-content">
                  <h3>{analytics.pendingInstitutes || 0}</h3>
                  <p>Pending Institutes</p>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon reviews">⭐</div>
                <div className="card-content">
                  <h3>{analytics.totalReviews || 0}</h3>
                  <p>Total Reviews</p>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon enquiries">📧</div>
                <div className="card-content">
                  <h3>{analytics.totalEnquiries || 0}</h3>
                  <p>Total Enquiries</p>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon courses">📚</div>
                <div className="card-content">
                  <h3>{analytics.totalCourses || 0}</h3>
                  <p>Total Courses</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <Link to="/admin/dashboard/institutes/pending" className="action-btn">
                  <span>📋</span>
                  <span>Manage Institutes</span>
                  <small>{analytics.pendingInstitutes || 0} pending</small>
                </Link>
                
                <Link to="/admin/dashboard/users" className="action-btn">
                  <span>👥</span>
                  <span>Manage Users</span>
                  <small>{analytics.totalUsers || 0} total</small>
                </Link>
                
                <Link to="/admin/dashboard/analytics" className="action-btn">
                  <span>📊</span>
                  <span>View Analytics</span>
                  <small>Platform insights</small>
                </Link>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="recent-activities">
              <div className="activity-section">
                <h3>New Users</h3>
                <div className="activity-list">
                  {recentActivities.newUsers?.length > 0 ? (
                    recentActivities.newUsers.map(user => (
                      <div key={user._id} className="activity-item">
                        <div className="activity-avatar">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="activity-details">
                          <p><strong>{user.name}</strong> registered</p>
                          <small>{new Date(user.createdAt).toLocaleDateString()}</small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-activity">
                      <p>No new users</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="activity-section">
                <h3>Pending Institutes</h3>
                <div className="activity-list">
                  {recentActivities.pendingInstitutes?.length > 0 ? (
                    recentActivities.pendingInstitutes.map(institute => (
                      <div key={institute._id} className="activity-item">
                        <div className="activity-avatar">
                          {institute.name?.charAt(0).toUpperCase() || 'I'}
                        </div>
                        <div className="activity-details">
                          <p><strong>{institute.name}</strong> waiting approval</p>
                          <small>{institute.category} • {institute.affiliation}</small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-activity">
                      <p>No pending institutes</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="activity-section">
                <h3>Recent Reviews</h3>
                <div className="activity-list">
                  {recentActivities.recentReviews?.length > 0 ? (
                    recentActivities.recentReviews.map(review => (
                      <div key={review._id} className="activity-item">
                        <div className="activity-avatar">
                          {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="activity-details">
                          <p>
                            <strong>{review.user?.name}</strong> reviewed 
                            <strong> {review.institute?.name}</strong>
                          </p>
                          <div className="rating">
                            {'⭐'.repeat(review.rating)}
                          </div>
                          <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-activity">
                      <p>No recent reviews</p>
                    </div>
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