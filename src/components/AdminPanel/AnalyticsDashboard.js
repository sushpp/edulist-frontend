// src/pages/AnalyticsDashboard.js
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await adminService.getDashboardAnalytics();
        // SAFE: Extract data object
        setAnalytics(res.data || {});
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setAnalytics({});
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div className="analytics-dashboard">
      <h2>Platform Analytics</h2>
      <select value={timeRange} onChange={e => setTimeRange(e.target.value)}>
        <option value="week">Last Week</option>
        <option value="month">Last Month</option>
        <option value="quarter">Last Quarter</option>
        <option value="year">Last Year</option>
      </select>

      <div className="metrics-grid">
        <div className="metric-card">
          <div>👥</div>
          <h3>{analytics.totalUsers || 0}</h3>
          <p>Total Users</p>
        </div>
        <div className="metric-card">
          <div>🏫</div>
          <h3>{analytics.totalInstitutes || 0}</h3>
          <p>Approved Institutes</p>
        </div>
        <div className="metric-card">
          <div>⏳</div>
          <h3>{analytics.pendingInstitutes || 0}</h3>
          <p>Pending Approvals</p>
        </div>
        <div className="metric-card">
          <div>⭐</div>
          <h3>{analytics.totalReviews || 0}</h3>
          <p>Total Reviews</p>
        </div>
        <div className="metric-card">
          <div>📧</div>
          <h3>{analytics.totalEnquiries || 0}</h3>
          <p>Total Enquiries</p>
        </div>
        <div className="metric-card">
          <div>📚</div>
          <h3>{analytics.totalCourses || 0}</h3>
          <p>Total Courses</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
