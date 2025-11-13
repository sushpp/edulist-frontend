// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { instituteService } from '../../services/institute';
import { useAuth } from '../../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const [featuredInstitutes, setFeaturedInstitutes] = useState([]);
  const [stats, setStats] = useState({ institutes: 0, reviews: 0, students: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null); // State to hold the error message

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedInstitutes();
    fetchStats();
  }, []);

  const fetchFeaturedInstitutes = async () => {
    setIsLoading(true);
    setFetchError(null); // Reset error on new fetch
    try {
      const response = await instituteService.getAllInstitutes();
      const featured = response.institutes.slice(0, 6);
      setFeaturedInstitutes(featured);
    } catch (error) {
      console.error('Error fetching featured institutes:', error);
      setFetchError(error.message); // Set the user-friendly error message
      setFeaturedInstitutes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    setStats({ institutes: 125, reviews: 2400, students: 15000 });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/institutes?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const getAverageRating = (institute) => {
    if (!institute.reviews || !Array.isArray(institute.reviews) || institute.reviews.length === 0) return 0;
    const sum = institute.reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return (sum / institute.reviews.length).toFixed(1);
  };

  return (
    <div className="homepage">
      {/* ... (All other sections like Hero, Features, CTA, Categories remain the same) */}
      
      {/* Featured Institutes Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Institutes</h2>
            <Link to="/institutes" className="view-all">View All →</Link>
          </div>
          
          <div className="institutes-grid">
            {isLoading ? (
              <div className="loading-state">
                <p>Loading featured institutes...</p>
              </div>
            ) : fetchError ? (
              <div className="error-state">
                <p>Failed to load institutes.</p>
                <p>{fetchError}</p>
                <button onClick={fetchFeaturedInstitutes} className="btn btn-primary">Try Again</button>
              </div>
            ) : featuredInstitutes.length > 0 ? (
              featuredInstitutes.map(institute => (
                <div key={institute._id} className="institute-card">
                  <div className="card-image">
                    <div className="image-placeholder">{institute.name.charAt(0).toUpperCase()}</div>
                    <div className="card-badge"><span className="rating">⭐ {getAverageRating(institute)}</span></div>
                  </div>
                  <div className="card-content">
                    <h3>{institute.name}</h3>
                    <p className="category">{institute.category} • {institute.affiliation}</p>
                    <p className="location">📍 {institute.address?.city}, {institute.address?.state}</p>
                    <p className="description">{institute.description?.substring(0, 80)}...</p>
                  </div>
                  <div className="card-actions">
                    <Link to={`/institute/${institute._id}`} className="btn btn-primary">View Details</Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No featured institutes available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;