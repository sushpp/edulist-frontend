import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserSidebar from './UserSidebar';
import api from '../../services/api';
import './UserPanel.css';

const UserReviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews/user');
        setReviews(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <div className="loading">Loading reviews...</div>;
  }

  return (
    <div className="dashboard-layout">
      <UserSidebar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>My Reviews</h1>
          <div className="table-actions">
            <span>{reviews.length} total reviews</span>
          </div>
        </div>
        
        <div className="table-container">
          <div className="table-header">
            <h2>All Reviews</h2>
          </div>
          
          {reviews.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Institute</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(review => (
                  <tr key={review._id}>
                    <td>
                      <div className="institute-info">
                        <strong>{review.instituteId?.name}</strong>
                        <div className="institute-meta">
                          {review.instituteId?.city}, {review.instituteId?.state}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="rating">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star ${i < review.rating ? 'active' : ''}`}
                          ></i>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="review-text">
                        {review.reviewText.substring(0, 100)}
                        {review.reviewText.length > 100 && '...'}
                      </div>
                    </td>
                    <td>{new Date(review.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${review.approvalStatus}`}>
                        {review.approvalStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">
              <h3>No reviews yet</h3>
              <p>Start reviewing institutes to see them here</p>
              <a href="/institutes" className="btn btn-primary mt-2">
                Browse Institutes
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReviews;