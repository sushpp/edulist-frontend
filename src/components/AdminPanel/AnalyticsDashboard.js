import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';

const AnalyticsDashboard = () => {
  // Initialize with default values to prevent undefined errors
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalInstitutes: 0,
    pendingInstitutes: 0,
    totalReviews: 0,
    totalEnquiries: 0,
    totalCourses: 0,
  });
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getDashboardAnalytics();
      
      // Safe extraction with defaults
      const data = response?.analytics || {};
      setAnalytics({
        totalUsers: data.totalUsers || 0,
        totalInstitutes: data.totalInstitutes || 0,
        pendingInstitutes: data.pendingInstitutes || 0,
        totalReviews: data.totalReviews || 0,
        totalEnquiries: data.totalEnquiries || 0,
        totalCourses: data.totalCourses || 0,
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="analytics-dashboard">
      <div className="page-header">
        <h2>Platform Analytics</h2>
        <div className="time-filter">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>{analytics.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🏫</div>
          <div className="metric-content">
            <h3>{analytics.totalInstitutes}</h3>
            <p>Approved Institutes</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏳</div>
          <div className="metric-content">
            <h3>{analytics.pendingInstitutes}</h3>
            <p>Pending Approvals</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-content">
            <h3>{analytics.totalReviews}</h3>
            <p>Total Reviews</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📧</div>
          <div className="metric-content">
            <h3>{analytics.totalEnquiries}</h3>
            <p>Total Enquiries</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📚</div>
          <div className="metric-content">
            <h3>{analytics.totalCourses}</h3>
            <p>Total Courses</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <h3>User Registration Trend</h3>
          <div className="chart-placeholder">
            <p>📈 Chart visualization goes here</p>
          </div>
        </div>
        <div className="chart-card">
          <h3>Institute Categories</h3>
          <div className="chart-placeholder">
            <p>📊 Category distribution chart goes here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
