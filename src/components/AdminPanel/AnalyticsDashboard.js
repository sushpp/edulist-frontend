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

  const [featuredInstitutes, setFeaturedInstitutes] = useState([]);
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminService.getDashboardAnalytics();
      const data = response || {};

      // Safe setting of analytics
      const a = data.analytics || {};
      setAnalytics({
        totalUsers: a.totalUsers ?? 0,
        totalInstitutes: a.totalInstitutes ?? 0,
        pendingInstitutes: a.pendingInstitutes ?? 0,
        totalReviews: a.totalReviews ?? 0,
        totalEnquiries: a.totalEnquiries ?? 0,
        totalCourses: a.totalCourses ?? 0,
      });

      // Safe setting of featured institutes
      setFeaturedInstitutes(Array.isArray(data.featuredInstitutes) ? data.featuredInstitutes : []);

    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to fetch analytics');
      setAnalytics({
        totalUsers: 0,
        totalInstitutes: 0,
        pendingInstitutes: 0,
        totalReviews: 0,
        totalEnquiries: 0,
        totalCourses: 0,
      });
      setFeaturedInstitutes([]);
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
            <h3>{analytics?.totalUsers ?? 0}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🏫</div>
          <div className="metric-content">
            <h3>{analytics?.totalInstitutes ?? 0}</h3>
            <p>Approved Institutes</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏳</div>
          <div className="metric-content">
            <h3>{analytics?.pendingInstitutes ?? 0}</h3>
            <p>Pending Approvals</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-content">
            <h3>{analytics?.totalReviews ?? 0}</h3>
            <p>Total Reviews</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📧</div>
          <div className="metric-content">
            <h3>{analytics?.totalEnquiries ?? 0}</h3>
            <p>Total Enquiries</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📚</div>
          <div className="metric-content">
            <h3>{analytics?.totalCourses ?? 0}</h3>
            <p>Total Courses</p>
          </div>
        </div>
      </div>

      {/* Featured Institutes */}
      <div className="featured-institutes">
        <h3>Featured Institutes</h3>
        {featuredInstitutes.length === 0 ? (
          <p>No featured institutes available</p>
        ) : (
          <ul>
            {featuredInstitutes.map(inst => (
              <li key={inst?._id || inst?.id}>
                {inst?.name ?? 'Unnamed Institute'} ({inst?.category ?? 'No category'})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
