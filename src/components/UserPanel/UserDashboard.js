import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import './UserPanel.css';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user's recent enquiries
        const enquiriesRes = await api.get('/enquiries');
        setRecentEnquiries(enquiriesRes.data.slice(0, 5));
        
        // Fetch user's recent reviews
        const reviewsRes = await api.get('/reviews/user');
        setRecentReviews(reviewsRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Find and review educational institutions</p>
      </div>
      
      <div className="dashboard-actions">
        <div className="action-card">
          <div className="action-icon">
            <i className="fas fa-search"></i>
          </div>
          <h3>Browse Institutes</h3>
          <p>Search and explore educational institutions</p>
          <Link to="/institutes" className="btn btn-primary">Browse</Link>
        </div>
        
        <div className="action-card">
          <div className="action-icon">
            <i className="fas fa-star"></i>
          </div>
          <h3>Write Reviews</h3>
          <p>Share your experience with institutes</p>
          <Link to="/institutes" className="btn btn-primary">Write Review</Link>
        </div>
        
        <div className="action-card">
          <div className="action-icon">
            <i className="fas fa-envelope"></i>
          </div>
          <h3>Send Enquiries</h3>
          <p>Contact institutes for more information</p>
          <Link to="/institutes" className="btn btn-primary">Send Enquiry</Link>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="content-section">
          <h2>Recent Enquiries</h2>
          {loading ? (
            <p>Loading...</p>
          ) : recentEnquiries.length > 0 ? (
            <div className="recent-list">
              {recentEnquiries.map(enquiry => (
                <div key={enquiry._id} className="recent-item">
                  <div className="item-info">
                    <h4>{enquiry.instituteId?.name}</h4>
                    <p>{new Date(enquiry.date).toLocaleDateString()}</p>
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
            <p>No enquiries yet. Start exploring institutes!</p>
          )}
        </div>
        
        <div className="content-section">
          <h2>Recent Reviews</h2>
          {loading ? (
            <p>Loading...</p>
          ) : recentReviews.length > 0 ? (
            <div className="recent-list">
              {recentReviews.map(review => (
                <div key={review._id} className="recent-item">
                  <div className="item-info">
                    <h4>{review.instituteId?.name}</h4>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${i < review.rating ? 'active' : ''}`}
                        ></i>
                      ))}
                    </div>
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
            <p>No reviews yet. Share your experience!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;