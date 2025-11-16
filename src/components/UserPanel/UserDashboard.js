import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/review';
import { enquiryService } from '../../services/enquiry';

const UserDashboard = () => {
  const { user } = useAuth();
  const [userReviews, setUserReviews] = useState([]);
  const [userEnquiries, setUserEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch user's reviews and enquiries
      const [reviewsResponse, enquiriesResponse] = await Promise.all([
        reviewService.getUserReviews(),
        enquiryService.getUserEnquiries()
      ]);
      
      // FIX: Ensure we always get arrays, even if API returns non-array data
      const reviewsData = Array.isArray(reviewsResponse) ? reviewsResponse : 
                         reviewsResponse?.data ? reviewsResponse.data : 
                         reviewsResponse?.reviews ? reviewsResponse.reviews : [];
      
      const enquiriesData = Array.isArray(enquiriesResponse) ? enquiriesResponse : 
                           enquiriesResponse?.data ? enquiriesResponse.data : 
                           enquiriesResponse?.enquiries ? enquiriesResponse.enquiries : [];
      
      setUserReviews(reviewsData);
      setUserEnquiries(enquiriesData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // FIX: Set empty arrays on error to prevent .map errors
      setUserReviews([]);
      setUserEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your dashboard...</div>;
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's your activity and saved information</p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{userReviews.length}</h3>
            <p>Reviews Written</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-content">
            <h3>{userEnquiries.length}</h3>
            <p>Enquiries Sent</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-content">
            <h3>0</h3>
            <p>Saved Institutes</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Recent Reviews */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Your Recent Reviews</h2>
            <Link to="/institutes" className="btn btn-outline">
              Write New Review
            </Link>
          </div>
          
          {!userReviews || userReviews.length === 0 ? (
            <div className="empty-state">
              <p>You haven't written any reviews yet.</p>
              <Link to="/institutes" className="btn btn-primary">
                Browse Institutes
              </Link>
            </div>
          ) : (
            <div className="reviews-list">
              {/* FIX: Added array safety check before mapping */}
              {Array.isArray(userReviews) && userReviews.slice(0, 5).map(review => (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <h4>{review.institute?.name}</h4>
                    <div className="rating">
                      {'⭐'.repeat(review.rating || 0)}
                    </div>
                  </div>
                  <p className="review-text">{review.reviewText}</p>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Enquiries */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Your Recent Enquiries</h2>
            <Link to="/institutes" className="btn btn-outline">
              Send New Enquiry
            </Link>
          </div>
          
          {!userEnquiries || userEnquiries.length === 0 ? (
            <div className="empty-state">
              <p>You haven't sent any enquiries yet.</p>
              <Link to="/institutes" className="btn btn-primary">
                Contact Institutes
              </Link>
            </div>
          ) : (
            <div className="enquiries-list">
              {/* FIX: Added array safety check before mapping */}
              {Array.isArray(userEnquiries) && userEnquiries.slice(0, 5).map(enquiry => (
                <div key={enquiry._id} className="enquiry-item">
                  <div className="enquiry-header">
                    <h4>{enquiry.institute?.name}</h4>
                    <span className={`status-badge ${enquiry.status}`}>
                      {enquiry.status}
                    </span>
                  </div>
                  <p className="enquiry-message">{enquiry.message}</p>
                  {enquiry.response && (
                    <div className="enquiry-response">
                      <strong>Response: </strong>
                      {enquiry.response}
                    </div>
                  )}
                  <span className="enquiry-date">
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/institutes" className="action-btn">
              <span>🔍</span>
              <span>Browse Institutes</span>
            </Link>
            <Link to="/institutes?category=school" className="action-btn">
              <span>🏫</span>
              <span>Find Schools</span>
            </Link>
            <Link to="/institutes?category=college" className="action-btn">
              <span>🎓</span>
              <span>Find Colleges</span>
            </Link>
            <Link to="/institutes?category=coaching" className="action-btn">
              <span>📚</span>
              <span>Find Coaching</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;