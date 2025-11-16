import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalInstitutes: 0,
    pendingInstitutes: 0,
    totalReviews: 0,
    totalEnquiries: 0,
    totalCourses: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDashboardAnalytics();
      setAnalytics(data.analytics);
      setRecentActivities(data.recentActivities);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics...</div>;

  return (
    <div className="analytics-dashboard">
      <div className="page-header">
        <h2>Platform Analytics</h2>
        <select value={timeRange} onChange={e => setTimeRange(e.target.value)}>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">👥 <h3>{analytics.totalUsers}</h3> <p>Total Users</p></div>
        <div className="metric-card">🏫 <h3>{analytics.totalInstitutes}</h3> <p>Approved Institutes</p></div>
        <div className="metric-card">⏳ <h3>{analytics.pendingInstitutes}</h3> <p>Pending Approvals</p></div>
        <div className="metric-card">⭐ <h3>{analytics.totalReviews}</h3> <p>Total Reviews</p></div>
        <div className="metric-card">📧 <h3>{analytics.totalEnquiries}</h3> <p>Total Enquiries</p></div>
        <div className="metric-card">📚 <h3>{analytics.totalCourses}</h3> <p>Total Courses</p></div>
      </div>

      <div className="activity-section">
        <h3>Recent Activity</h3>
        {recentActivities.length === 0 ? (
          <p>No recent activity</p>
        ) : (
          <ul>
            {recentActivities.map((item, idx) => (
              <li key={idx}>{item.description || 'Activity event'}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
