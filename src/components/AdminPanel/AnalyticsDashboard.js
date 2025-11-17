import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import api from '../../services/api';
import './AdminPanel.css';

const AnalyticsDashboard = () => {
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
    return <div className="loading">Loading analytics...</div>;
  }

  const getPercentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Analytics Dashboard</h1>
        </div>
        
        <div className="analytics-overview">
          <div className="analytics-card">
            <h3>Institute Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Total Institutes</div>
                <div className="stat-value">{analytics?.totalInstitutes || 0}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Approved</div>
                <div className="stat-value">{analytics?.approvedInstitutes || 0}</div>
                <div className="stat-percentage">
                  {getPercentage(analytics?.approvedInstitutes, analytics?.totalInstitutes)}%
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Pending</div>
                <div className="stat-value">{analytics?.pendingInstitutes || 0}</div>
                <div className="stat-percentage">
                  {getPercentage(analytics?.pendingInstitutes, analytics?.totalInstitutes)}%
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Rejected</div>
                <div className="stat-value">{analytics?.rejectedInstitutes || 0}</div>
                <div className="stat-percentage">
                  {getPercentage(analytics?.rejectedInstitutes, analytics?.totalInstitutes)}%
                </div>
              </div>
            </div>
          </div>
          
          <div className="analytics-card">
            <h3>User Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Total Users</div>
                <div className="stat-value">{analytics?.totalUsers || 0}</div>
              </div>
            </div>
          </div>
          
          <div className="analytics-card">
            <h3>Review Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Total Reviews</div>
                <div className="stat-value">{analytics?.totalReviews || 0}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Approved</div>
                <div className="stat-value">{analytics?.approvedReviews || 0}</div>
                <div className="stat-percentage">
                  {getPercentage(analytics?.approvedReviews, analytics?.totalReviews)}%
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Pending</div>
                <div className="stat-value">{analytics?.pendingReviews || 0}</div>
                <div className="stat-percentage">
                  {getPercentage(analytics?.pendingReviews, analytics?.totalReviews)}%
                </div>
              </div>
            </div>
          </div>
          
          <div className="analytics-card">
            <h3>Enquiry Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Total Enquiries</div>
                <div className="stat-value">{analytics?.totalEnquiries || 0}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="charts-section">
          <div className="chart-card">
            <h3>Institute Status Distribution</h3>
            <div className="chart-content">
              <div className="pie-chart">
                <div className="pie-segment approved" style={{ 
                  width: `${getPercentage(analytics?.approvedInstitutes, analytics?.totalInstitutes)}%` 
                }}></div>
                <div className="pie-segment pending" style={{ 
                  width: `${getPercentage(analytics?.pendingInstitutes, analytics?.totalInstitutes)}%` 
                }}></div>
                <div className="pie-segment rejected" style={{ 
                  width: `${getPercentage(analytics?.rejectedInstitutes, analytics?.totalInstitutes)}%` 
                }}></div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color approved"></div>
                  <span>Approved ({analytics?.approvedInstitutes})</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color pending"></div>
                  <span>Pending ({analytics?.pendingInstitutes})</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color rejected"></div>
                  <span>Rejected ({analytics?.rejectedInstitutes})</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="chart-card">
            <h3>Platform Metrics</h3>
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-value">{analytics?.totalInstitutes || 0}</div>
                <div className="metric-label">Total Institutes</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">{analytics?.totalUsers || 0}</div>
                <div className="metric-label">Total Users</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">{analytics?.totalReviews || 0}</div>
                <div className="metric-label">Total Reviews</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">{analytics?.totalEnquiries || 0}</div>
                <div className="metric-label">Total Enquiries</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;