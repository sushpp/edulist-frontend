// src/pages/InstituteList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { instituteService } from '../../services/institute';
import './UserPanel.css';

const InstituteList = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '', city: '', minFees: '', maxFees: '', facilities: '', rating: ''
  });

  // DEBUG: Log state whenever it changes
  useEffect(() => {
    console.log('InstituteList state changed:', { institutes, loading, error });
  }, [institutes, loading, error]);

  const fetchInstitutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await instituteService.getAllInstitutes(filters);
      
      // CRITICAL DEBUG: Log the entire response object from the service
      console.log('Full response from instituteService.getAllInstitutes():', response);
      
      // The service should return an object with an 'institutes' property
      const institutesArray = Array.isArray(response?.institutes) ? response.institutes : [];
      
      // CRITICAL DEBUG: Log what we're about to set as state
      console.log('Setting institutes state to:', institutesArray);
      setInstitutes(institutesArray);
    } catch (err) {
      console.error('Error in fetchInstitutes:', err);
      setError(err.message || 'Failed to fetch institutes');
      setInstitutes([]); // Always set to an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutes();
  }, [filters]);

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({ category: '', city: '', minFees: '', maxFees: '', facilities: '', rating: '' });

  const getAverageRating = (inst) => {
    if (!inst.reviews || !Array.isArray(inst.reviews) || inst.reviews.length === 0) return 0;
    const sum = inst.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / inst.reviews.length).toFixed(1);
  };

  const getPrimaryImage = (inst) => {
    if (!inst.images || !Array.isArray(inst.images) || inst.images.length === 0) return null;
    return inst.images.find(img => img.isPrimary) || inst.images[0];
  };

  const getImageUrl = (image) => image?.url?.replace('http://', 'https://') || null;

  if (loading) {
    return <div className="loading">Loading institutes...</div>;
  }

  // CRITICAL DEBUG: Add a try-catch around the entire render
  try {
    // BULLETPROOF: Create a constant that is GUARANTEED to be a valid array for rendering
    const safeInstitutesForRendering = Array.isArray(institutes) ? institutes : [];
    
    return (
      <div className="institute-list-page">
        <div className="page-header">
          <h1>Find Educational Institutes</h1>
          <p>Discover the best schools, colleges, and coaching centers</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-header">
            <h3>Filters</h3>
            <button onClick={clearFilters} className="clear-filters">Clear All</button>
          </div>
          <div className="filters-grid">
            {/* Category */}
            <div className="filter-group">
              <label>Category</label>
              <select value={filters.category} onChange={e => handleFilterChange('category', e.target.value)}>
                <option value="">All Categories</option>
                <option value="school">School</option>
                <option value="college">College</option>
                <option value="university">University</option>
                <option value="coaching">Coaching Center</option>
                <option value="preschool">Preschool</option>
              </select>
            </div>
            {/* City */}
            <div className="filter-group">
              <label>City</label>
              <input type="text" placeholder="Enter city" value={filters.city} onChange={e => handleFilterChange('city', e.target.value)} />
            </div>
            {/* Fees */}
            <div className="filter-group">
              <label>Min Fees (₹)</label>
              <input type="number" placeholder="Min" value={filters.minFees} onChange={e => handleFilterChange('minFees', e.target.value)} />
            </div>
            <div className="filter-group">
              <label>Max Fees (₹)</label>
              <input type="number" placeholder="Max" value={filters.maxFees} onChange={e => handleFilterChange('maxFees', e.target.value)} />
            </div>
            {/* Facilities */}
            <div className="filter-group">
              <label>Facilities</label>
              <select value={filters.facilities} onChange={e => handleFilterChange('facilities', e.target.value)}>
                <option value="">All Facilities</option>
                <option value="library">Library</option>
                <option value="sports">Sports</option>
                <option value="lab">Laboratory</option>
                <option value="hostel">Hostel</option>
                <option value="transport">Transport</option>
              </select>
            </div>
            {/* Rating */}
            <div className="filter-group">
              <label>Minimum Rating</label>
              <select value={filters.rating} onChange={e => handleFilterChange('rating', e.target.value)}>
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
          {error ? (
            <div className="error-message">
              {error}
              <button onClick={fetchInstitutes} className="btn btn-primary">Retry</button>
            </div>
          ) : (
            <>
              {/* BULLETPROOF: Check the guaranteed array for emptiness */}
              {safeInstitutesForRendering.length === 0 ? (
                <div className="empty-state">No institutes found matching your criteria.</div>
              ) : (
                safeInstitutesForRendering.map(inst => {
                  // BULLETPROOF: Ensure each item is an object
                  if (!inst || typeof inst !== 'object') {
                    console.warn('Invalid institute object in map:', inst);
                    return null;
                  }
                  
                  const primaryImage = getPrimaryImage(inst);
                  const imageUrl = getImageUrl(primaryImage);
                  const logoUrl = getImageUrl(inst.logo);
                  
                  return (
                    <div key={inst._id || inst.id || Math.random().toString(36).substr(2, 9)} className="institute-card">
                      <div className="card-image">
                        {imageUrl && <img src={imageUrl} alt={inst.name} />}
                        <div className="image-placeholder">
                          {logoUrl ? <img src={logoUrl} alt="logo" /> : inst.name?.charAt(0).toUpperCase() || 'I'}
                        </div>
                        <div className="card-badge">
                          <span>⭐ {getAverageRating(inst)}</span>
                          <span>({inst.reviews?.length || 0} reviews)</span>
                        </div>
                      </div>
                      <div className="card-content">
                        <h3>{inst.name || 'Unnamed Institute'}</h3>
                        <p>{inst.category || 'Unknown Category'}</p>
                        <p>📍 {inst.address?.city || 'Unknown City'}</p>
                        <p>{inst.description?.substring(0, 100) || 'No description'}</p>
                        <Link to={`/institute/${inst._id}`} className="btn btn-primary">View Details</Link>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    );
  } catch (renderError) {
    // This is the last resort. If the render itself fails, we catch it here.
    console.error('CRITICAL: InstituteList render failed with error:', renderError);
    console.error('State at time of crash:', { institutes, loading, error, filters });
    return (
      <div className="error-message">
        <h3>A critical rendering error occurred.</h3>
        <p>Please check the browser console for details and refresh the page.</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">Refresh Page</button>
      </div>
    );
  }
};

export default InstituteList;