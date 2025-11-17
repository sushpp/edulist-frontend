import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import api from '../../services/api';
import './AdminPanel.css';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        setAnalytics(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="user-info">
            <div className="user-avatar">
              A
            </div>
            <div className="user-name">
              <div>Admin</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-cards">
          <div className="dashboard-card primary">
            <div className="card-icon">
              <i className="fas fa-university"></i>
            </div>
            <h3>Total Institutes</h3>
            <div className="card-value">{analytics?.totalInstitutes || 0}</div>
          </div>
          
          <div className="dashboard-card success">
            <div className="card-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>Approved Institutes</h3>
            <div className="card-value">{analytics?.approvedInstitutes || 0}</div>
          </div>
          
          <div className="dashboard-card warning">
            <div className="card-icon">
              <i className="fas fa-clock"></i>
            </div>
            <h3>Pending Institutes</h3>
            <div className="card-value">{analytics?.pendingInstitutes || 0}</div>
          </div>
          
          <div className="dashboard-card danger">
            <div className="card-icon">
              <i className="fas fa-times-circle"></i>
            </div>
            <h3>Rejected Institutes</h3>
            <div className="card-value">{analytics?.rejectedInstitutes || 0}</div>
          </div>
          
          <div className="dashboard-card info">
            <div className="card-icon">
              <i className="fas fa-users"></i>
            </div>
            <h3>Total Users</h3>
            <div className="card-value">{analytics?.totalUsers || 0}</div>
          </div>
          
          <div className="dashboard-card primary">
            <div className="card-icon">
              <i className="fas fa-star"></i>
            </div>
            <h3>Total Reviews</h3>
            <div className="card-value">{analytics?.totalReviews || 0}</div>
          </div>
          
          <div className="dashboard-card success">
            <div className="card-icon">
              <i className="fas fa-comment"></i>
            </div>
            <h3>Approved Reviews</h3>
            <div className="card-value">{analytics?.approvedReviews || 0}</div>
          </div>
          
          <div className="dashboard-card warning">
            <div className="card-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <h3>Total Enquiries</h3>
            <div className="card-value">{analytics?.totalEnquiries || 0}</div>
          </div>
        </div>
        
        <div className="dashboard-sections">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <Link to="/admin/institutes" className="action-card">
                <div className="action-icon">
                  <i className="fas fa-university"></i>
                </div>
                <h3>Manage Institutes</h3>
                <p>Approve or reject institute registrations</p>
              </Link>
              
              <Link to="/admin/users" className="action-card">
                <div className="action-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>Manage Users</h3>
                <p>View and manage user accounts</p>
              </Link>
              
              <Link to="/admin/analytics" className="action-card">
                <div className="action-icon">
                  <i className="fas fa-chart-bar"></i>
                </div>
                <h3>View Analytics</h3>
                <p>Detailed platform analytics and insights</p>
              </Link>
            </div>
          </div>
          
          <div className="dashboard-section">
            <div className="section-header">
              <h2>System Overview</h2>
            </div>
            <div className="overview-stats">
              <div className="stat-item">
                <h4>Institute Approval Rate</h4>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${analytics?.totalInstitutes > 0 ? (analytics?.approvedInstitutes / analytics?.totalInstitutes) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <span className="stat-value">
                  {analytics?.totalInstitutes > 0 ? Math.round((analytics?.approvedInstitutes / analytics?.totalInstitutes) * 100) : 0}%
                </span>
              </div>
              
              <div className="stat-item">
                <h4>Review Approval Rate</h4>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${analytics?.totalReviews > 0 ? (analytics?.approvedReviews / analytics?.totalReviews) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <span className="stat-value">
                  {analytics?.totalReviews > 0 ? Math.round((analytics?.approvedReviews / analytics?.totalReviews) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;