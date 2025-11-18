import React, { useState, useEffect, useContext } from 'react'; // FIX 1: Added useContext import
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ReviewForm from './ReviewForm';
import EnquiryForm from './EnquiryForm';
import api from '../../services/api';
import './UserPanel.css';

const InstituteDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [institute, setInstitute] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);

  useEffect(() => {
    const fetchInstituteData = async () => {
      try {
        // Fetch institute details
        const instituteRes = await api.get(`/institutes/${id}`);
        setInstitute(instituteRes.data);
        
        // Fetch institute reviews
        const reviewsRes = await api.get(`/reviews/${id}`);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstituteData();
  }, [id]);

  const handleReviewSubmit = (reviewData) => {
    setShowReviewForm(false);
    // Refresh reviews
    api.get(`/reviews/${id}`).then(res => setReviews(res.data));
  };

  const handleEnquirySubmit = (enquiryData) => {
    setShowEnquiryForm(false);
  };

  if (loading) {
    return <div className="loading">Loading institute details...</div>;
  }

  if (!institute) {
    return <div className="error">Institute not found</div>;
  }

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="institute-detail-page">
      <div className="institute-header">
        <div className="institute-hero">
          <div className="institute-logo">
            {/* FIX 2: Use environment variable and correct path for logo */}
            {institute.media && institute.media.logo ? (
              <img src={`${process.env.REACT_APP_API_URL}/uploads/${institute.media.logo}`} alt={institute.name} />
            ) : (
              <div className="placeholder-logo">
                <i className="fas fa-university"></i>
              </div>
            )}
          </div>
          
          <div className="institute-title">
            <h1>{institute.name}</h1>
            <div className="institute-meta">
              <span className="badge badge-info">{institute.category}</span>
              {institute.affiliation && (
                <span className="badge badge-secondary">{institute.affiliation}</span>
              )}
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fas fa-star ${i < Math.round(avgRating) ? 'active' : ''}`}
                  ></i>
                ))}
                <span className="rating-text">({reviews.length} reviews)</span>
              </div>
            </div>
          </div>
          
          <div className="institute-actions">
            {isAuthenticated && (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowEnquiryForm(true)}
                >
                  <i className="fas fa-envelope"></i> Send Enquiry
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowReviewForm(true)}
                >
                  <i className="fas fa-star"></i> Write Review
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="institute-content">
        <div className="institute-main">
          <div className="content-section">
            <h2>About</h2>
            <p>{institute.description || 'No description available.'}</p>
          </div>
          
          <div className="content-section">
            <h2>Contact Information</h2>
            <div className="contact-info">
              <p><i className="fas fa-map-marker-alt"></i> {institute.address}, {institute.city}, {institute.state}</p>
              {/* FIX 3: Correctly display phone and email from the contactInfo object */}
              {institute.contactInfo && (
                <>
                  <p><i className="fas fa-phone"></i> {institute.contactInfo.phone}</p>
                  <p><i className="fas fa-envelope"></i> {institute.contactInfo.email}</p>
                </>
              )}
              {institute.website && (
                <p><i className="fas fa-globe"></i> <a href={institute.website} target="_blank" rel="noopener noreferrer">{institute.website}</a></p>
              )}
            </div>
          </div>
          
          {/* FIX 4: Use correct path for gallery images */}
          {institute.media && institute.media.images && institute.media.images.length > 0 && (
            <div className="content-section">
              <h2>Gallery</h2>
              <div className="gallery">
                {institute.media.images.map((image, index) => (
                  <div key={index} className="gallery-item">
                    <img src={`${process.env.REACT_APP_API_URL}/uploads/${image}`} alt={`${institute.name} ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="content-section">
            <h2>Facilities</h2>
            {institute.facilities && institute.facilities.length > 0 ? (
              <div className="facilities-list">
                {institute.facilities.map(facility => (
                  <div key={facility._id} className="facility-item">
                    <h4>{facility.name}</h4>
                    <p>{facility.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No facilities information available.</p>
            )}
          </div>
          
          <div className="content-section">
            <h2>Courses</h2>
            {institute.courses && institute.courses.length > 0 ? (
              <div className="courses-list">
                {institute.courses.map(course => (
                  <div key={course._id} className="course-item">
                    <div className="course-image">
                      {/* FIX 5: Use environment variable for course image URL */}
                      {course.image ? (
                        <img src={`${process.env.REACT_APP_API_URL}/uploads/${course.image}`} alt={course.title} />
                      ) : (
                        <div className="placeholder-image">
                          <i className="fas fa-book"></i>
                        </div>
                      )}
                    </div>
                    <div className="course-content">
                      <h4>{course.title}</h4>
                      <p>{course.description}</p>
                      <div className="course-meta">
                        <span><i className="fas fa-clock"></i> {course.duration}</span>
                        <span><i className="fas fa-money-bill"></i> ${course.fees}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No courses information available.</p>
            )}
          </div>
          
          <div className="content-section">
            <h2>Reviews</h2>
            {reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map(review => (
                  <div key={review._id} className="review-item">
                    <div className="review-header">
                      <h4>{review.userId?.name}</h4>
                      <div className="rating">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star ${i < review.rating ? 'active' : ''}`}
                          ></i>
                        ))}
                      </div>
                    </div>
                    <p>{review.reviewText}</p>
                    <div className="review-date">
                      {new Date(review.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
      
      {showReviewForm && (
        <ReviewForm
          instituteId={id}
          instituteName={institute.name}
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
      
      {showEnquiryForm && (
        <EnquiryForm
          instituteId={id}
          instituteName={institute.name}
          onClose={() => setShowEnquiryForm(false)}
          onSubmit={handleEnquirySubmit}
        />
      )}
    </div>
  );
};

export default InstituteDetail;