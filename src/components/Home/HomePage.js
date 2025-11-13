// src/pages/HomePage.js
// Version 3.0 - Added "Try Again" Button
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
  const [fetchError, setFetchError] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedInstitutes();
    fetchStats();
  }, []);

  const fetchFeaturedInstitutes = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await instituteService.getAllInstitutes();
      const featured = response.institutes.slice(0, 6);
      setFeaturedInstitutes(featured);
    } catch (error) {
      console.error('Error fetching featured institutes:', error);
      setFetchError(error.message);
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
      {/* Hero Section */}
      <section className="hero-section">
        {/* ... (All your other sections are correct) */}
      </section>

      {/* Featured Institutes Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Institutes</h2>
            <Link to="/institutes" className="view-all">View All →</Link>
          </div>
          
          <div className="institutes-grid">
            {isLoading ? (
              <div className="loading-state"><p>Loading featured institutes...</p></div>
            ) : fetchError ? (
              <div className="error-state">
                <p>Failed to load institutes.</p>
                <p>{fetchError}</p>
                <button onClick={fetchFeaturedInstitutes} className="btn btn-primary">Try Again</button>
              </div>
            ) : featuredInstitutes.length > 0 ? (
              featuredInstitutes.map(institute => (
                <div key={institute._id} className="institute-card">
                  {/* ... card content ... */}
                </div>
              ))
            ) : (
              <div className="empty-state"><p>No featured institutes available at the moment.</p></div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;