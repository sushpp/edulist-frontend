import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';

const FeaturedInstitutes = () => {
  const [featuredInstitutes, setFeaturedInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedInstitutes();
  }, []);

  const fetchFeaturedInstitutes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const analyticsData = await adminService.getDashboardAnalytics();
      
      // CRITICAL DEBUG: Log the exact value and type we're getting from the service
      console.log('Data received from adminService:', analyticsData);
      console.log('Type of featuredInstitutes:', typeof analyticsData?.featuredInstitutes);
      console.log('Is featuredInstitutes an array?', Array.isArray(analyticsData?.featuredInstitutes));
      
      // The service should ensure this is an array, but we validate it again
      const institutes = Array.isArray(analyticsData?.featuredInstitutes) 
        ? analyticsData.featuredInstitutes 
        : [];
      
      setFeaturedInstitutes(institutes);
    } catch (err) {
      console.error('Error in FeaturedInstitutes component:', err);
      setError('Failed to load featured institutes.');
      setFeaturedInstitutes([]); // Always set to an array
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading featured institutes...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={fetchFeaturedInstitutes} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  // ULTRA-DEFENSIVE: Check the array type RIGHT HERE, before any other logic
  if (!Array.isArray(featuredInstitutes)) {
    console.error('CRITICAL: featuredInstitutes state is not an array! Value:', featuredInstitutes);
    return <div className="error-message">Data format error. Please refresh the page.</div>;
  }

  // ULTRA-DEFENSIVE: Check if the array is empty
  if (featuredInstitutes.length === 0) {
    return <div>No featured institutes are available at this time.</div>;
  }

  // ULTRA-DEFENSIVE: Create the display array and check it again before slicing
  const displayInstitutes = Array.isArray(featuredInstitutes) 
    ? featuredInstitutes.slice(0, 6) 
    : [];
  
  return (
    <div className="featured-institutes-section">
      <h2>Featured Institutes</h2>
      <div className="institutes-grid">
        {displayInstitutes.map(institute => {
          // ULTRA-DEFENSIVE: Check each item inside the map
          if (!institute || typeof institute !== 'object') {
            console.warn('Invalid institute object in map:', institute);
            return null;
          }
          
          return (
            <div key={institute._id || institute.id || Math.random().toString(36).substr(2, 9)} className="institute-card">
              <div className="institute-header">
                <h3>{institute.name || 'Unnamed Institute'}</h3>
              </div>
              
              <div className="institute-details">
                <div className="detail-row">
                  <span className="label">Category:</span>
                  <span className="value">{institute.category || 'Not specified'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Affiliation:</span>
                  <span className="value">{institute.affiliation || 'Not specified'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Location:</span>
                  <span className="value">
                    {institute.address?.city || 'Unknown city'}, {institute.address?.state || 'Unknown state'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedInstitutes;