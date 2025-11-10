import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const data = await adminService.getDashboardAnalytics();
      setAnalytics(data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

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
            <small>+12% from last month</small>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🏫</div>
          <div className="metric-content">
            <h3>{analytics.totalInstitutes}</h3>
            <p>Approved Institutes</p>
            <small>+8% from last month</small>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏳</div>
          <div className="metric-content">
            <h3>{analytics.pendingInstitutes}</h3>
            <p>Pending Approvals</p>
            <small>Waiting for review</small>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-content">
            <h3>{analytics.totalReviews}</h3>
            <p>Total Reviews</p>
            <small>+25% from last month</small>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📧</div>
          <div className="metric-content">
            <h3>{analytics.totalEnquiries}</h3>
            <p>Total Enquiries</p>
            <small>+15% from last month</small>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📚</div>
          <div className="metric-content">
            <h3>{analytics.totalCourses}</h3>
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
            <div className="mock-chart">
              <div className="chart-bar" style={{ height: '80%' }}></div>
              <div className="chart-bar" style={{ height: '60%' }}></div>
              <div className="chart-bar" style={{ height: '90%' }}></div>
              <div className="chart-bar" style={{ height: '70%' }}></div>
              <div className="chart-bar" style={{ height: '85%' }}></div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Institute Categories</h3>
          <div className="chart-placeholder">
            <p>📊 Category distribution chart</p>
            <div className="mock-pie-chart">
              <div className="pie-segment" style={{ backgroundColor: '#3498db' }}></div>
              <div className="pie-segment" style={{ backgroundColor: '#e74c3c' }}></div>
              <div className="pie-segment" style={{ backgroundColor: '#2ecc71' }}></div>
              <div className="pie-segment" style={{ backgroundColor: '#f39c12' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <h3>Recent Platform Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">🎓</div>
            <div className="activity-content">
              <p><strong>5 new institutes</strong> registered in the last 24 hours</p>
              <small>2 hours ago</small>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">⭐</div>
            <div className="activity-content">
              <p><strong>12 new reviews</strong> submitted by users</p>
              <small>4 hours ago</small>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📧</div>
            <div className="activity-content">
              <p><strong>8 new enquiries</strong> sent to institutes</p>
              <small>6 hours ago</small>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">👥</div>
            <div className="activity-content">
              <p><strong>23 new users</strong> joined the platform</p>
              <small>1 day ago</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;