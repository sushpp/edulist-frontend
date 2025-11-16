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
      const [reviewsResponse, enquiriesResponse] = await Promise.all([
        reviewService.getUserReviews(),
        enquiryService.getUserEnquiries()
      ]);

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
      setUserReviews([]);
      setUserEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading your dashboard...</div>;

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
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
      </div>

      {/* Recent Reviews */}
      <div className="dashboard-section">
        <h2>Your Recent Reviews</h2>
        {Array.isArray(userReviews) && userReviews.length > 0 ? (
          userReviews.slice(0, 5).map(review => (
            <div key={review._id || review.id} className="review-item">
              <h4>{review.institute?.name}</h4>
              <div>{'⭐'.repeat(review.rating ?? 0)}</div>
              <p>{review.reviewText}</p>
              <small>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</small>
            </div>
          ))
        ) : <p>No reviews yet.</p>}
      </div>

      {/* Recent Enquiries */}
      <div className="dashboard-section">
        <h2>Your Recent Enquiries</h2>
        {Array.isArray(userEnquiries) && userEnquiries.length > 0 ? (
          userEnquiries.slice(0, 5).map(enquiry => (
            <div key={enquiry._id || enquiry.id} className="enquiry-item">
              <h4>{enquiry.institute?.name}</h4>
              <p>{enquiry.message}</p>
              {enquiry.response && <p>Response: {enquiry.response}</p>}
              <small>{enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : ''}</small>
            </div>
          ))
        ) : <p>No enquiries yet.</p>}
      </div>
    </div>
  );
};

export default UserDashboard;
