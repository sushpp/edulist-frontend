import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { instituteService } from '../../services/institute';
import { reviewService } from '../../services/review';
import { enquiryService } from '../../services/enquiry';
import { courseService } from '../../services/course';
import ReviewForm from './ReviewForm';
import EnquiryForm from './EnquiryForm';
import Loading from '../Common/Loading';
import './UserPanel.css';

const InstituteDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [institute, setInstitute] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchInstituteDetail();
  }, [id]);

  const fetchInstituteDetail = async () => {
    try {
      setError('');
      const institutes = await instituteService.getAllInstitutes();
      const foundInstitute = institutes.find(inst => inst._id === id);
      
      if (foundInstitute) {
        setInstitute(foundInstitute);
        
        // Try to fetch courses and reviews, but don't fail if they error
        try {
          const coursesData = await courseService.getInstituteCourses(id);
          setCourses(coursesData);
        } catch (courseError) {
          console.log('No courses found');
          setCourses([]);
        }
        
        try {
          const reviewsData = await reviewService.getInstituteReviews(id);
          setReviews(reviewsData);
        } catch (reviewError) {
          console.log('No reviews found');
          setReviews([]);
        }
      } else {
        setError('Institute not found');
      }
    } catch (error) {
      console.error('Error fetching institute details:', error);
      setError('Failed to load institute details');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      await reviewService.createReview({
        ...reviewData,
        institute: id
      });
      setShowReviewForm(false);
      fetchInstituteDetail();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    }
  };

  const handleEnquirySubmit = async (enquiryData) => {
    try {
      await enquiryService.createEnquiry({
        ...enquiryData,
        institute: id
      });
      setShowEnquiryForm(false);
      alert('Enquiry submitted successfully!');
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Error submitting enquiry. Please try again.');
    }
  };

  const getAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  // Get primary image or first image
  const getPrimaryImage = () => {
    if (!institute) return null;
    
    // For mock data, we don't have actual images, so we'll use a placeholder
    return null;
  };

  // Get all images including primary
  const getAllImages = () => {
    if (!institute) return [];
    
    // For now, return empty array since we don't have actual image data
    // You can add mock images here for testing
    return [];
  };

  // Helper function to get image URL
  const getImageUrl = (image) => {
    if (!image || !image.url) return null;
    if (image.url.startsWith('http')) {
      return image.url;
    }
    return `http://localhost:5000${image.url}`;
  };

  if (loading) {
    return <Loading message="Loading institute details..." />;
  }

  if (error || !institute) {
    return (
      <div className="error-page">
        <h2>Institute Not Found</h2>
        <p>{error || 'The institute you are looking for does not exist.'}</p>
        <a href="/institutes" className="btn btn-primary">Browse Institutes</a>
      </div>
    );
  }

  const primaryImage = getPrimaryImage();
  const allImages = getAllImages();

  return (
    <div className="institute-detail">
      {/* Header Section with Images */}
      <div className="institute-header">
        <div className="header-background">
          {institute.images && institute.images.length > 0 ? (
            <img 
              src={getImageUrl(institute.images.find(img => img.isPrimary) || institute.images[0])}
              alt={institute.name}
              className="header-background-image"
            />
          ) : (
            <div className="header-background-placeholder">
              {institute.logo ? (
                <img 
                  src={getImageUrl(institute.logo)}
                  alt={`${institute.name} Logo`}
                  className="header-logo-large"
                />
              ) : (
                <span className="header-initial">
                  {institute.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          )}
          <div className="header-overlay"></div>
        </div>
        
        <div className="header-content">
          <div className="institute-basic">
            {institute.logo && (
              <img 
                src={getImageUrl(institute.logo)}
                alt={`${institute.name} Logo`}
                className="institute-header-logo"
              />
            )}
            <div className="institute-info">
              <h1>{institute.name}</h1>
              <div className="institute-meta">
                <span className="category">{institute.category}</span>
                <span className="affiliation">{institute.affiliation}</span>
                <div className="rating-section">
                  <span className="rating">⭐ {getAverageRating()}</span>
                  <span className="review-count">({reviews.length} reviews)</span>
                </div>
              </div>
              <p className="location">
                📍 {institute.address?.street}, {institute.address?.city}, {institute.address?.state} - {institute.address?.pincode}
              </p>
            </div>
          </div>

          <div className="header-actions">
            <button 
              onClick={() => setShowEnquiryForm(true)}
              className="btn btn-primary"
            >
              📧 Enquire Now
            </button>
            <button 
              onClick={() => setShowReviewForm(true)}
              className="btn btn-outline"
              disabled={!user}
            >
              ⭐ Write Review
            </button>
            {!user && (
              <small style={{color: '#e74c3c', display: 'block', marginTop: '5px'}}>
                Please login to write a review
              </small>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="detail-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          Courses ({courses.length})
        </button>
        <button 
          className={`tab ${activeTab === 'facilities' ? 'active' : ''}`}
          onClick={() => setActiveTab('facilities')}
        >
          Facilities ({institute.facilities?.length || 0})
        </button>
        <button 
          className={`tab ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          Gallery ({allImages.length})
        </button>
        <button 
          className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews ({reviews.length})
        </button>
        <button 
          className={`tab ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          Contact
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="description-section">
              <h3>About {institute.name}</h3>
              <p>{institute.description}</p>
            </div>

            <div className="quick-info">
              <div className="info-card">
                <h4>📞 Contact Info</h4>
                <p><strong>Email:</strong> {institute.contact?.email}</p>
                <p><strong>Phone:</strong> {institute.contact?.phone}</p>
                {institute.contact?.website && (
                  <p><strong>Website:</strong> <a href={institute.contact.website} target="_blank" rel="noopener noreferrer">
                    {institute.contact.website}
                  </a></p>
                )}
              </div>

              <div className="info-card">
                <h4>📍 Location</h4>
                <p>{institute.address?.street}</p>
                <p>{institute.address?.city}, {institute.address?.state}</p>
                <p><strong>Pincode:</strong> {institute.address?.pincode}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="courses-tab">
            <h3>Available Courses</h3>
            {courses.length === 0 ? (
              <div className="empty-state">
                <p>No courses listed yet. Check back later or contact the institute for course information.</p>
              </div>
            ) : (
              <div className="courses-grid">
                {courses.map(course => (
                  <div key={course._id} className="course-card">
                    <h4>{course.title}</h4>
                    <p className="course-description">{course.description}</p>
                    <div className="course-details">
                      <div className="detail-item">
                        <strong>Duration:</strong> {course.duration}
                      </div>
                      <div className="detail-item">
                        <strong>Fees:</strong> ₹{course.fees?.toLocaleString()}
                      </div>
                      {course.eligibility && (
                        <div className="detail-item">
                          <strong>Eligibility:</strong> {course.eligibility}
                        </div>
                      )}
                      {course.category && (
                        <div className="detail-item">
                          <strong>Category:</strong> {course.category}
                        </div>
                      )}
                    </div>
                    {course.facilities && course.facilities.length > 0 && (
                      <div className="course-facilities">
                        <strong>Facilities:</strong>
                        <div className="facilities-tags">
                          {course.facilities.map((facility, index) => (
                            <span key={index} className="facility-tag">
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'facilities' && (
          <div className="facilities-tab">
            <h3>Facilities & Infrastructure</h3>
            {(!institute.facilities || institute.facilities.length === 0) ? (
              <div className="empty-state">
                <p>No facilities information available yet.</p>
              </div>
            ) : (
              <div className="facilities-grid">
                {institute.facilities.map((facility, index) => (
                  <div key={index} className="facility-item">
                    <h4>{facility.name}</h4>
                    {facility.description && (
                      <p>{facility.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="gallery-tab">
            <h3>Institute Gallery</h3>
            {allImages.length === 0 ? (
              <div className="empty-state">
                <p>No images available for this institute.</p>
                <div className="placeholder-gallery">
                  <div className="placeholder-image">
                    <span className="placeholder-icon">🏫</span>
                    <p>Institute Building</p>
                  </div>
                  <div className="placeholder-image">
                    <span className="placeholder-icon">📚</span>
                    <p>Classrooms</p>
                  </div>
                  <div className="placeholder-image">
                    <span className="placeholder-icon">⚽</span>
                    <p>Sports Facilities</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="gallery-grid">
                {allImages.map((image, index) => (
                  <div key={index} className="gallery-item">
                    <img 
                      src={getImageUrl(image)} 
                      alt={`${institute.name} - ${image.type === 'logo' ? 'Logo' : 'Image ' + (index + 1)}`}
                      onClick={() => setSelectedImageIndex(index)}
                    />
                    {image.type === 'logo' && (
                      <div className="image-badge">Logo</div>
                    )}
                    {image.isPrimary && image.type !== 'logo' && (
                      <div className="image-badge primary">Primary</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="reviews-tab">
            <div className="reviews-header">
              <h3>Student & Parent Reviews</h3>
              <div className="average-rating">
                <div className="rating-score">{getAverageRating()}</div>
                <div className="rating-stars">
                  {'⭐'.repeat(5)}
                </div>
                <div className="rating-count">{reviews.length} reviews</div>
              </div>
            </div>

            <div className="reviews-list">
              {reviews.length === 0 ? (
                <div className="empty-state">
                  <p>No reviews yet. Be the first to review this institute!</p>
                  {user && (
                    <button 
                      onClick={() => setShowReviewForm(true)}
                      className="btn btn-primary"
                    >
                      Write First Review
                    </button>
                  )}
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review._id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <strong>{review.user?.name || 'Anonymous'}</strong>
                          <div className="review-rating">
                            {'⭐'.repeat(review.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="review-text">{review.reviewText}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="contact-tab">
            <h3>Contact Information</h3>
            <div className="contact-details">
              <div className="contact-info">
                <h4>📞 Phone</h4>
                <p>{institute.contact?.phone}</p>
              </div>
              <div className="contact-info">
                <h4>📧 Email</h4>
                <p>{institute.contact?.email}</p>
              </div>
              {institute.contact?.website && (
                <div className="contact-info">
                  <h4>🌐 Website</h4>
                  <p>
                    <a href={institute.contact.website} target="_blank" rel="noopener noreferrer">
                      {institute.contact.website}
                    </a>
                  </p>
                </div>
              )}
              <div className="contact-info">
                <h4>📍 Address</h4>
                <p>{institute.address?.street}</p>
                <p>{institute.address?.city}, {institute.address?.state}</p>
                <p><strong>Pincode:</strong> {institute.address?.pincode}</p>
              </div>
            </div>

            <div className="map-placeholder">
              <h4>📍 Location Map</h4>
              <div className="map-container">
                <p>Map would be integrated here showing the institute location</p>
                <div className="mock-map">
                  <div className="map-marker">📍</div>
                  <p>{institute.address?.city}, {institute.address?.state}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showReviewForm && (
        <ReviewForm
          institute={institute}
          onSubmit={handleReviewSubmit}
          onClose={() => setShowReviewForm(false)}
        />
      )}

      {showEnquiryForm && (
        <EnquiryForm
          institute={institute}
          onSubmit={handleEnquirySubmit}
          onClose={() => setShowEnquiryForm(false)}
        />
      )}
    </div>
  );
};

export default InstituteDetail;