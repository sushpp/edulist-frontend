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

  // -------------------------------------------------------
  // ULTRA-DEFENSIVE: Normalize the response from the service
  const normalizeInstituteResponse = (response) => {
    // Case 1: Response is an array directly
    if (Array.isArray(response)) {
      return response;
    }
    // Case 2: Response is an object with an 'institutes' property that is an array
    if (response && typeof response === 'object' && Array.isArray(response.institutes)) {
      return response.institutes;
    }
    // Case 3: Response is an object with a 'data' property that contains an 'institutes' array
    if (response && typeof response === 'object' && response.data && Array.isArray(response.data.institutes)) {
      return response.data.institutes;
    }
    
    // Case 4: Anything else is unexpected, return an empty array to prevent crashes
    console.warn('Unexpected response structure from instituteService:', response);
    return [];
  };

  const fetchFeaturedInstitutes = async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const response = await instituteService.getAllInstitutes();
      console.log("🔍 Raw API Response in HomePage:", response);

      const institutesArray = normalizeInstituteResponse(response);
      console.log("✅ Normalized array for HomePage:", institutesArray);

      // BULLETPROOF: Set state with a guaranteed array
      setFeaturedInstitutes(Array.isArray(institutesArray) ? institutesArray : []);

    } catch (error) {
      console.error("❌ Error fetching featured institutes:", error);
      setFetchError(error.message || "Failed to fetch institutes");
      // BULLETPROOF: Always set to an array on error
      setFeaturedInstitutes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    setStats({
      institutes: 125,
      reviews: 2400,
      students: 15000
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/institutes?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const getAverageRating = (institute) => {
    if (!institute?.reviews || !Array.isArray(institute.reviews) || institute.reviews.length === 0) return 0;
    const sum = institute.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / institute.reviews.length).toFixed(1);
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect Educational Institute</h1>
          <p>Discover the best schools, colleges, and coaching centers</p>

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
            <div className="stat"><strong>{stats.institutes}</strong><span>Institutes</span></div>
            <div className="stat"><strong>{stats.reviews}</strong><span>Reviews</span></div>
            <div className="stat"><strong>{stats.students}</strong><span>Students</span></div>
          </div>
        </div>
      </section>

      {/* Featured Institutes */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Institutes</h2>
            <Link to="/institutes" className="view-all">View All →</Link>
          </div>

          <div className="institutes-grid">
            {isLoading ? (
              <div className="loading-state">Loading featured institutes...</div>
            ) : fetchError ? (
              <div className="error-state">
                <p>Error loading institutes.</p>
                <p>{fetchError}</p>
                <button onClick={fetchFeaturedInstitutes} className="btn btn-primary">Try Again</button>
              </div>
            ) : featuredInstitutes.length > 0 ? (
              featuredInstitutes.map((inst) => {
                // ULTRA-DEFENSIVE: Ensure each item is an object
                if (!inst || typeof inst !== 'object') {
                  console.warn('Invalid institute object in HomePage map:', inst);
                  return null;
                }

                return (
                  <div key={inst._id || inst.id || Math.random().toString(36).substr(2, 9)} className="institute-card">
                    <div className="card-image">
                      <div className="image-placeholder">{inst.name?.charAt(0).toUpperCase() || 'I'}</div>
                      <div className="card-badge">⭐ {getAverageRating(inst)}</div>
                    </div>
                    <div className="card-content">
                      <h3>{inst.name || 'Unnamed Institute'}</h3>
                      <p>{inst.category} • {inst.affiliation}</p>
                      <p>📍 {inst.address?.city}, {inst.address?.state}</p>
                      <p>{(inst.description || '').substring(0, 80)}...</p>
                      <Link to={`/institute/${inst._id}`} className="btn btn-primary">View Details</Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">No featured institutes found.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;