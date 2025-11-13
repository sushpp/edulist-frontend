import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { instituteService } from '../../services/institute';
import { useAuth } from '../../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const [featuredInstitutes, setFeaturedInstitutes] = useState([]);
  const [stats, setStats] = useState({ institutes: 0, reviews: 0, students: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- State for handling loading and errors ---
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
    setFetchError(null); // Reset error on new fetch
    try {
      // The service guarantees a { institutes: [] } structure
      const response = await instituteService.getAllInstitutes();
      const featured = response.institutes.slice(0, 6);
      setFeaturedInstitutes(featured);
    } catch (error) {
      console.error('Error fetching featured institutes:', error);
      setFetchError(error.message); // Set the error message to display
      setFeaturedInstitutes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    // This is static data, so no changes needed here
    setStats({ institutes: 125, reviews: 2400, students: 15000 });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/institutes?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const getAverageRating = (institute) => {
    // Added safety check for reviews array
    if (!institute.reviews || !Array.isArray(institute.reviews) || institute.reviews.length === 0) return 0;
    const sum = institute.reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return (sum / institute.reviews.length).toFixed(1);
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect Educational Institute</h1>
          <p>Discover the best schools, colleges, and coaching centers with authentic reviews and ratings</p>
          
          <form onSubmit={handleSearch} className="search-box">
            <input
              type="text"
              placeholder="Search for schools, colleges, coaching centers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">🔍 Search</button>
          </form>

          <div className="hero-stats">
            <div className="stat"><strong>{stats.institutes}+</strong><span>Institutes</span></div>
            <div className="stat"><strong>{stats.reviews}+</strong><span>Reviews</span></div>
            <div className="stat"><strong>{stats.students}+</strong><span>Students</span></div>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card-1"><span>🏫</span><p>Top Schools</p></div>
          <div className="floating-card card-2"><span>🎓</span><p>Best Colleges</p></div>
          <div className="floating-card card-3"><span>⭐</span><p>Rated 4.8/5</p></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose EduList?</h2>
          <div className="features-grid">
            <div className="feature-card"><div className="feature-icon">🔍</div><h3>Easy Search</h3><p>Find institutes by location, category, fees, and facilities with advanced filters</p></div>
            <div className="feature-card"><div className="feature-icon">⭐</div><h3>Authentic Reviews</h3><p>Read genuine reviews from students and parents to make informed decisions</p></div>
            <div className="feature-card"><div className="feature-icon">📊</div><h3>Detailed Profiles</h3><p>Comprehensive information about courses, facilities, fees, and admission process</p></div>
            <div className="feature-card"><div className="feature-icon">💬</div><h3>Direct Enquiry</h3><p>Contact institutes directly for more information or admission queries</p></div>
          </div>
        </div>
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
              <div className="loading-state">
                <div className="spinner"></div>
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

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Are You an Educational Institute?</h2>
            <p>Join EduList to reach thousands of students and parents looking for quality education</p>
            {user ? (user.role === 'institute' ? (<Link to="/institute/dashboard" className="btn btn-light">Go to Dashboard</Link>) : (<Link to="/register?role=institute" className="btn btn-light">Register Your Institute</Link>)) : (<Link to="/register?role=institute" className="btn btn-light">Register Your Institute</Link>)}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Browse by Category</h2>
          <div className="categories-grid">
            <Link to="/institutes?category=school" className="category-card"><span className="category-icon">🏫</span><h3>Schools</h3><p>CBSE, ICSE, State Boards</p></Link>
            <Link to="/institutes?category=college" className="category-card"><span className="category-icon">🎓</span><h3>Colleges</h3><p>Engineering, Medical, Arts</p></Link>
            <Link to="/institutes?category=university" className="category-card"><span className="category-icon">🏛️</span><h3>Universities</h3><p>Public and Private</p></Link>
            <Link to="/institutes?category=coaching" className="category-card"><span className="category-icon">📚</span><h3>Coaching</h3><p>IIT-JEE, NEET, UPSC</p></Link>
            <Link to="/institutes?category=preschool" className="category-card"><span className="category-icon">👶</span><h3>Preschools</h3><p>Playgroups, Kindergarten</p></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;