import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalInstitutes: 0,
    pendingInstitutes: 0,
    totalReviews: 0,
    totalEnquiries: 0,
    totalCourses: 0,
  });

  const [featuredInstitutes, setFeaturedInstitutes] = useState([]);
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminService.getDashboardAnalytics();

      // Safe destructuring with defaults
      const {
        analytics: analyticsData = {},
        featuredInstitutes: featured = [],
      } = response || {};

      // Ensure analytics values are numbers
      setAnalytics({
        totalUsers: Number(analyticsData.totalUsers) || 0,
        totalInstitutes: Number(analyticsData.totalInstitutes) || 0,
        pendingInstitutes: Number(analyticsData.pendingInstitutes) || 0,
        totalReviews: Number(analyticsData.totalReviews) || 0,
        totalEnquiries: Number(analyticsData.totalEnquiries) || 0,
        totalCourses: Number(analyticsData.totalCourses) || 0,
      });

      // Ensure featuredInstitutes is always an array
      setFeaturedInstitutes(Array.isArray(featured) ? featured : []);

    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="analytics-dashboard">
      <div className="page-header">
        <h2>Platform Analytics</h2>
        <div className="time-filter">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
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

      {/* Featured Institutes */}
      <div className="featured-institutes">
        <h3>Featured Institutes</h3>
        {Array.isArray(featuredInstitutes) && featuredInstitutes.length > 0 ? (
          <ul>
            {featuredInstitutes.map(inst => (
              <li key={inst._id || inst.id}>
                {inst.name || 'Unnamed Institute'} ({inst.category || 'No category'})
              </li>
            ))}
          </ul>
        ) : (
          <p>No featured institutes available</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
