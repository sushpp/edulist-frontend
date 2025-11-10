import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/review';
import { instituteService } from '../../services/institute';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstituteAndReviews();
  }, []);

  const fetchInstituteAndReviews = async () => {
    try {
      // Get institute profile first to get the institute ID
      const instituteData = await instituteService.getInstituteProfile();
      setInstitute(instituteData);
      
      // Then fetch reviews for this institute
      if (instituteData && instituteData._id) {
        const reviewsData = await reviewService.getInstituteReviews(instituteData._id);
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return <div className="loading">Loading reviews...</div>;
  }

  return (
    <div className="reviews-management">
      <div className="page-header">
        <h2>Student Reviews</h2>
        <p>View and manage reviews from students and parents</p>
      </div>

      {/* Reviews Summary */}
      <div className="reviews-summary">
        <div className="summary-card">
          <h3>Average Rating</h3>
          <div className="rating-display">
            <span className="average-rating">
              {reviews.length > 0 
                ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
                : '0.0'
              }
            </span>
            <div className="stars">
              {reviews.length > 0 
                ? getRatingStars(Math.round(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length))
                : '☆☆☆☆☆'
              }
            </div>
            <span className="review-count">({reviews.length} reviews)</span>
          </div>
        </div>

        <div className="summary-card">
          <h3>Rating Distribution</h3>
          <div className="rating-bars">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = reviews.filter(review => review.rating === stars).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              
              return (
                <div key={stars} className="rating-bar">
                  <span className="stars">{'⭐'.repeat(stars)}</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="count">({count})</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        <h3>All Reviews</h3>
        
        {reviews.length === 0 ? (
          <div className="empty-state">
            <p>No reviews received yet</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map(review => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <strong>{review.user?.name || 'Anonymous'}</strong>
                      <div className="review-rating">
                        {getRatingStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="review-text">{review.reviewText}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;