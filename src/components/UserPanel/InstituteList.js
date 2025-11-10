import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { instituteService } from '../../services/institute';
import './UserPanel.css';

const InstituteList = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    city: '',
    minFees: '',
    maxFees: '',
    facilities: '',
    rating: ''
  });

  useEffect(() => {
    fetchInstitutes();
  }, [filters]);

  const fetchInstitutes = async () => {
    try {
      const data = await instituteService.getAllInstitutes(filters);
      setInstitutes(data);
    } catch (error) {
      console.error('Error fetching institutes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      city: '',
      minFees: '',
      maxFees: '',
      facilities: '',
      rating: ''
    });
  };

  const getAverageRating = (institute) => {
    if (!institute.reviews || institute.reviews.length === 0) return 0;
    const sum = institute.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / institute.reviews.length).toFixed(1);
  };

  const getPrimaryImage = (institute) => {
    // Check if institute has images array and find primary image
    if (institute.images && institute.images.length > 0) {
      const primaryImage = institute.images.find(img => img.isPrimary);
      return primaryImage || institute.images[0];
    }
    return null;
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    // Handle both full URLs and relative paths
    if (image.url.startsWith('http')) {
      return image.url;
    }
    return `http://localhost:5000${image.url}`;
  };

  if (loading) {
    return <div className="loading">Loading institutes...</div>;
  }

  return (
    <div className="institute-list-page">
      <div className="page-header">
        <h1>Find Educational Institutes</h1>
        <p>Discover the best schools, colleges, and coaching centers</p>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>Filters</h3>
          <button onClick={clearFilters} className="clear-filters">
            Clear All
          </button>
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="school">School</option>
              <option value="college">College</option>
              <option value="university">University</option>
              <option value="coaching">Coaching Center</option>
              <option value="preschool">Preschool</option>
            </select>
          </div>

          <div className="filter-group">
            <label>City</label>
            <input
              type="text"
              placeholder="Enter city"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Min Fees (₹)</label>
            <input
              type="number"
              placeholder="Min"
              value={filters.minFees}
              onChange={(e) => handleFilterChange('minFees', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Max Fees (₹)</label>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxFees}
              onChange={(e) => handleFilterChange('maxFees', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Facilities</label>
            <select
              value={filters.facilities}
              onChange={(e) => handleFilterChange('facilities', e.target.value)}
            >
              <option value="">All Facilities</option>
              <option value="library">Library</option>
              <option value="sports">Sports</option>
              <option value="lab">Laboratory</option>
              <option value="hostel">Hostel</option>
              <option value="transport">Transport</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Minimum Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Institutes Grid */}
      <div className="institutes-grid">
        {institutes.length === 0 ? (
          <div className="empty-state">
            <h3>No institutes found</h3>
            <p>Try adjusting your filters to see more results</p>
          </div>
        ) : (
          institutes.map(institute => {
            const primaryImage = getPrimaryImage(institute);
            const imageUrl = getImageUrl(primaryImage);
            const logoUrl = getImageUrl(institute.logo);

            return (
              <div key={institute._id} className="institute-card">
                <div className="card-image">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={institute.name}
                      className="institute-main-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`image-placeholder ${imageUrl ? 'fallback' : ''}`}>
                    {logoUrl ? (
                      <img 
                        src={logoUrl} 
                        alt={`${institute.name} Logo`}
                        className="institute-logo"
                      />
                    ) : (
                      institute.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="card-badge">
                    <span className="rating">
                      ⭐ {getAverageRating(institute)}
                    </span>
                    <span className="reviews">
                      ({institute.reviews?.length || 0} reviews)
                    </span>
                  </div>
                  {institute.images && institute.images.length > 1 && (
                    <div className="image-count-badge">
                      +{institute.images.length - 1}
                    </div>
                  )}
                </div>

                <div className="card-content">
                  <div className="institute-header">
                    {logoUrl && (
                      <img 
                        src={logoUrl} 
                        alt={`${institute.name} Logo`}
                        className="institute-logo-small"
                      />
                    )}
                    <h3 className="institute-name">{institute.name}</h3>
                  </div>
                  <p className="institute-category">
                    {institute.category} • {institute.affiliation}
                  </p>
                  <p className="institute-location">
                    📍 {institute.address?.city}, {institute.address?.state}
                  </p>
                  <p className="institute-description">
                    {institute.description?.substring(0, 100)}...
                  </p>

                  <div className="facilities">
                    {institute.facilities?.slice(0, 3).map((facility, index) => (
                      <span key={index} className="facility-tag">
                        {facility.name}
                      </span>
                    ))}
                    {institute.facilities?.length > 3 && (
                      <span className="facility-tag">
                        +{institute.facilities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="card-actions">
                  <Link 
                    to={`/institute/${institute._id}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                  <Link 
                    to={`/institute/${institute._id}#enquiry`}
                    className="btn btn-outline"
                  >
                    Enquire Now
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InstituteList;