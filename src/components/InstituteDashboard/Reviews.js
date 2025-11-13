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
        // FIX: Ensure reviews is always an array with multiple fallbacks
        const safeReviewsData = Array.isArray(reviewsData) ? reviewsData : 
                               reviewsData?.reviews ? reviewsData.reviews : 
                               reviewsData?.data ? reviewsData.data : [];
        setReviews(safeReviewsData);
      } else {
        // FIX: Set empty array if no institute ID
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // FIX: Set empty array on error to prevent crashes
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const getRatingStars = (rating) => {
    // FIX: Ensure rating is a number and within valid range
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
    return '⭐'.repeat(safeRating) + '☆'.repeat(5 - safeRating);
  };

  // FIX: Calculate average rating safely
  const calculateAverageRating = () => {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return 0;
    
    const validReviews = reviews.filter(review => 
      review && typeof review.rating === 'number' && review.rating >= 1 && review.rating <= 5
    );
    
    if (validReviews.length === 0) return 0;
    
    const sum = validReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / validReviews.length).toFixed(1);
  };

  // FIX: Count reviews by rating safely
  const getRatingCount = (stars) => {
    if (!reviews || !Array.isArray(reviews)) return 0;
    return reviews.filter(review => 
      review && review.rating === stars
    ).length;
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
              {calculateAverageRating()}
            </span>
            <div className="stars">
              {getRatingStars(Math.round(calculateAverageRating()))}
            </div>
            <span className="review-count">
              ({Array.isArray(reviews) ? reviews.length : 0} reviews)
            </span>
          </div>
        </div>

        <div className="summary-card">
          <h3>Rating Distribution</h3>
          <div className="rating-bars">
            {/* FIX: Added safety checks for rating distribution */}
            {[5, 4, 3, 2, 1].map(stars => {
              const count = getRatingCount(stars);
              const totalReviews = Array.isArray(reviews) ? reviews.length : 0;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              
              return (
                <div key={stars} className="rating-bar">
                  <span className="stars">{getRatingStars(stars)}</span>
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
        
        {/* FIX: Enhanced empty state check */}
        {!reviews || !Array.isArray(reviews) || reviews.length === 0 ? (
          <div className="empty-state">
            <p>No reviews received yet</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {/* FIX: Added array safety check before mapping */}
            {Array.isArray(reviews) && reviews.map(review => (
              <div key={review._id || review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {/* FIX: Added safety check for user name */}
                      {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <strong>{review.user?.name || 'Anonymous'}</strong>
                      <div className="review-rating">
                        {/* FIX: Added safety check for rating */}
                        {getRatingStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  <span className="review-date">
                    {/* FIX: Added safety check for date */}
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Unknown date'}
                  </span>
                </div>
                
                <p className="review-text">
                  {/* FIX: Added safety check for review text */}
                  {review.reviewText || 'No review text provided'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;