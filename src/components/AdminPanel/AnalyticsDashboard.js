import React, { useState, useEffect } from "react";
import { adminService } from "../../services/admin";

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDashboardAnalytics();
      // If API returns undefined or missing analytics, fallback to {}
      setAnalytics(data?.analytics || {});
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setAnalytics({});
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics...</div>;

  // Destructure with defaults
  const {
    totalUsers = 0,
    totalInstitutes = 0,
    pendingInstitutes = 0,
    totalReviews = 0,
    totalEnquiries = 0,
    totalCourses = 0,
  } = analytics || {};

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
            <h3>{totalUsers}</h3>
            <p>Total Users</p>
            <small>+12% from last month</small>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🏫</div>
          <div className="metric-content">
            <h3>{totalInstitutes}</h3>
            <p>Approved Institutes</p>
            <small>+8% from last month</small>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏳</div>
          <div className="metric-content">
            <h3>{pendingInstitutes}</h3>
            <p>Pending Approvals</p>
            <small>Waiting for review</small>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-content">
            <h3>{totalReviews}</h3>
            <p>Total Reviews</p>
            <small>+25% from last month</small>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📧</div>
          <div className="metric-content">
            <h3>{totalEnquiries}</h3>
            <p>Total Enquiries</p>
            <small>+15% from last month</small>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📚</div>
          <div className="metric-content">
            <h3>{totalCourses}</h3>
            <p>Total Courses</p>
            <small>Active courses listed</small>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <h3>User Registration Trend</h3>
          <div className="chart-placeholder">
            <p>📈 Chart visualization would be implemented with a charting library</p>
          </div>
        </div>

        <div className="chart-card">
          <h3>Institute Categories</h3>
          <div className="chart-placeholder">
            <p>📊 Category distribution chart</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
