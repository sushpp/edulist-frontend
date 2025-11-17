import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import InstituteSidebar from './InstituteSidebar';
import api from '../../services/api';
import './InstituteDashboard.css';

const InstituteDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/institutes/dashboard/me');
        setDashboardData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-layout">
      <InstituteSidebar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user?.name}!</h1>
            <p>{dashboardData?.institute?.name}</p>
          </div>
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-name">
              <div>{user?.name}</div>
              <div className="user-role">Institute</div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-cards">
          <div className="dashboard-card primary">
            <div className="card-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <h3>Total Enquiries</h3>
            <div className="card-value">{dashboardData?.totalEnquiries || 0}</div>
          </div>
          
          <div className="dashboard-card success">
            <div className="card-icon">
              <i className="fas fa-star"></i>
            </div>
            <h3>Total Reviews</h3>
            <div className="card-value">{dashboardData?.totalReviews || 0}</div>
          </div>
          
          <div className="dashboard-card warning">
            <div className="card-icon">
              <i className="fas fa-book"></i>
            </div>
            <h3>Total Courses</h3>
            <div className="card-value">{dashboardData?.institute?.courses?.length || 0}</div>
          </div>
          
          <div className="dashboard-card info">
            <div className="card-icon">
              <i className="fas fa-building"></i>
            </div>
            <h3>Total Facilities</h3>
            <div className="card-value">{dashboardData?.institute?.facilities?.length || 0}</div>
          </div>
        </div>
        
        <div className="dashboard-sections">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Enquiries</h2>
              <Link to="/institute/enquiries" className="btn btn-sm">View All</Link>
            </div>
            <div className="section-content">
              {dashboardData?.enquiries?.length > 0 ? (
                <div className="recent-list">
                  {dashboardData.enquiries.slice(0, 5).map(enquiry => (
                    <div key={enquiry._id} className="recent-item">
                      <div className="item-info">
                        <h4>{enquiry.userId?.name}</h4>
                        <p>{enquiry.message.substring(0, 100)}...</p>
                        <span className="date">{new Date(enquiry.date).toLocaleDateString()}</span>
                      </div>
                      <div className="item-status">
                        <span className={`status-badge ${enquiry.status}`}>
                          {enquiry.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No enquiries yet</p>
              )}
            </div>
          </div>
          
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Reviews</h2>
              <Link to="/institute/reviews" className="btn btn-sm">View All</Link>
            </div>
            <div className="section-content">
              {dashboardData?.reviews?.length > 0 ? (
                <div className="recent-list">
                  {dashboardData.reviews.slice(0, 5).map(review => (
                    <div key={review._id} className="recent-item">
                      <div className="item-info">
                        <h4>{review.userId?.name}</h4>
                        <div className="rating">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fas fa-star ${i < review.rating ? 'active' : ''}`}
                            ></i>
                          ))}
                        </div>
                        <p>{review.reviewText.substring(0, 100)}...</p>
                        <span className="date">{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                      <div className="item-status">
                        <span className={`status-badge ${review.approvalStatus}`}>
                          {review.approvalStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No reviews yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteDashboard;