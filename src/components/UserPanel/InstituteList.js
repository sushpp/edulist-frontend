import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { instituteService } from '../../services/institute';
import './UserPanel.css';

const API_URL = process.env.REACT_APP_API_URL;

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
    // eslint-disable-next-line
  }, [filters]);

  const fetchInstitutes = async () => {
    try {
      const data = await instituteService.getAllInstitutes(filters);
      // Ensure the response has the expected structure and is an array
      if (data && Array.isArray(data.institutes)) {
        setInstitutes(data.institutes);
      } else {
        setInstitutes([]);
      }
    } catch (error) {
      console.error('Error fetching institutes:', error);
      setInstitutes([]);
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

  // === FIX 1: Added safety checks to prevent crashes ===
  const getAverageRating = (institute) => {
    // Check if reviews exist and is an array before reducing
    if (!institute.reviews || !Array.isArray(institute.reviews) || institute.reviews.length === 0) return 0;
    const sum = institute.reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return (sum / institute.reviews.length).toFixed(1);
  };

  // === FIX 2: Added safety checks to prevent crashes ===
  const getPrimaryImage = (institute) => {
    // Check if images exist and is an array before finding
    if (!institute.images || !Array.isArray(institute.images) || institute.images.length === 0) {
      return null;
    }
    const primaryImage = institute.images.find(img => img.isPrimary);
    return primaryImage || institute.images[0];
  };

  // === FIX 3: Force HTTPS to prevent Mixed Content warnings ===
  const getImageUrl = (image) => {
    if (!image || !image.url) return null;
    // Force HTTPS to avoid mixed content issues
    return image.url.replace('http://', 'https://');
  };

  if (loading) return <div className="loading">Loading institutes...</div>;

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
          <button onClick={clearFilters} className="clear-filters">Clear All</button>
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
          // === FIX 4: Added safety check before the main .map() call ===
          institutes && Array.isArray(institutes) && institutes.map(inst => {
            const primaryImage = getPrimaryImage(inst);
            const imageUrl = getImageUrl(primaryImage);
            const logoUrl = getImageUrl(inst.logo);

            return (
              <div key={inst._id} className="institute-card">
                <div className="card-image">
                  {imageUrl && <img src={imageUrl} alt={inst.name} className="institute-main-image" />}
                  <div className="image-placeholder">
                    {logoUrl ? <img src={logoUrl} alt={`${inst.name} Logo`} className="institute-logo" />
                      : inst.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="card-badge">
                    <span className="rating">⭐ {getAverageRating(inst)}</span>
                    <span className="reviews">({inst.reviews?.length || 0} reviews)</span>
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="institute-name">{inst.name}</h3>
                  <p className="institute-category">{inst.category} • {inst.affiliation}</p>
                  <p className="institute-location">📍 {inst.address?.city}, {inst.address?.state}</p>
                  <p className="institute-description">{inst.description?.substring(0, 100)}...</p>
                </div>

                <div className="card-actions">
                  <Link to={`/institute/${inst._id}`} className="btn btn-primary">View Details</Link>
                  <Link to={`/institute/${inst._id}#enquiry`} className="btn btn-outline">Enquire Now</Link>
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