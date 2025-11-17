import React, { useState, useEffect } from 'react';
import InstituteSidebar from './InstituteSidebar';
import api from '../../services/api';
import './InstituteDashboard.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/institutes/dashboard/me');
        setReviews(res.data.reviews);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReviews();
  }, []);

  const handleFlagReview = async (id) => {
    if (window.confirm('Are you sure you want to flag this review as inappropriate?')) {
      setLoading(true);
      setAlert(null);

      try {
        await api.put(`/reviews/${id}`, { approvalStatus: 'pending' });
        setReviews(reviews.map(review => 
          review._id === id ? { ...review, approvalStatus: 'pending' } : review
        ));
        setAlert({ type: 'success', message: 'Review flagged for review!' });
      } catch (err) {
        setAlert({ type: 'danger', message: 'Failed to flag review' });
      } finally {
        setLoading(false);
      }
    }
  };

  const viewReview = (review) => {
    setSelectedReview(review);
  };

  const closeReview = () => {
    setSelectedReview(null);
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="dashboard-layout">
      <InstituteSidebar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Reviews</h1>
          <div className="table-actions">
            <span>{reviews.length} total reviews</span>
          </div>
        </div>
        
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}
        
        <div className="dashboard-cards">
          <div className="dashboard-card primary">
            <div className="card-icon">
              <i className="fas fa-star"></i>
            </div>
            <h3>Average Rating</h3>
            <div className="card-value">{calculateAverageRating()}</div>
          </div>
          
          <div className="dashboard-card success">
            <div className="card-icon">
              <i className="fas fa-thumbs-up"></i>
            </div>
            <h3>5 Star Reviews</h3>
            <div className="card-value">{ratingDistribution[5]}</div>
          </div>
          
          <div className="dashboard-card warning">
            <div className="card-icon">
              <i className="fas fa-comment"></i>
            </div>
            <h3>Total Reviews</h3>
            <div className="card-value">{reviews.length}</div>
          </div>
        </div>
        
        <div className="rating-distribution">
          <h3>Rating Distribution</h3>
          <div className="distribution-bars">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="rating-bar">
                <span className="rating-label">{rating} stars</span>
                <div className="bar-container">
                  <div 
                    className="bar" 
                    style={{ width: `${reviews.length > 0 ? (ratingDistribution[rating] / reviews.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="rating-count">{ratingDistribution[rating]}</span>
              </div>
            ))}
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
                  <th>User</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(review => (
                  <tr key={review._id}>
                    <td>
                      <div className="user-info">
                        <strong>{review.userId?.name}</strong>
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
                      <div className="review-preview">
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
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => viewReview(review)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        {review.approvalStatus === 'approved' && (
                          <button 
                            className="btn btn-sm btn-warning"
                            onClick={() => handleFlagReview(review._id)}
                            disabled={loading}
                          >
                            <i className="fas fa-flag"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">
              <h3>No reviews yet</h3>
              <p>Reviews from users will appear here</p>
            </div>
          )}
        </div>
        
        {selectedReview && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Review Details</h2>
                <button className="modal-close" onClick={closeReview}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="modal-body">
                <div className="review-details">
                  <div className="detail-section">
                    <h3>User Information</h3>
                    <p><strong>Name:</strong> {selectedReview.userId?.name}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h3>Rating</h3>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${i < selectedReview.rating ? 'active' : ''}`}
                        ></i>
                      ))}
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h3>Review</h3>
                    <p>{selectedReview.reviewText}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h3>Status</h3>
                    <span className={`status-badge ${selectedReview.approvalStatus}`}>
                      {selectedReview.approvalStatus}
                    </span>
                  </div>
                  
                  <div className="detail-section">
                    <h3>Date</h3>
                    <p>{new Date(selectedReview.date).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                {selectedReview.approvalStatus === 'approved' && (
                  <button 
                    className="btn btn-warning"
                    onClick={() => {
                      handleFlagReview(selectedReview._id);
                      closeReview();
                    }}
                    disabled={loading}
                  >
                    Flag as Inappropriate
                  </button>
                )}
                <button className="btn btn-primary" onClick={closeReview}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;