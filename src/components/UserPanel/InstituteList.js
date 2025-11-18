import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './UserPanel.css';

const InstituteList = () => {
  const [institutes, setInstitutes] = useState([]);
  const [filteredInstitutes, setFilteredInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    category: '',
    board: '',
  });

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const res = await api.get('/institutes');
        setInstitutes(res.data);
        setFilteredInstitutes(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutes();
  }, []);

  useEffect(() => {
    let result = institutes;

    if (filters.search) {
      result = result.filter(institute =>
        institute.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.city) {
      result = result.filter(institute =>
        institute.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.category) {
      result = result.filter(institute =>
        institute.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.board) {
      result = result.filter(institute =>
        institute.affiliation && institute.affiliation.toLowerCase().includes(filters.board.toLowerCase())
      );
    }

    setFilteredInstitutes(result);
  }, [filters, institutes]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      category: '',
      board: '',
    });
  };

  return (
    <div className="institute-list-page">
      <div className="page-header">
        <h1>Educational Institutes</h1>
        <p>Find and explore educational institutions</p>
      </div>
      
      <div className="filters-section">
        <div className="filter-card">
          <h3>Filter Institutes</h3>
          <div className="filter-form">
            <div className="form-group">
              <input
                type="text"
                name="search"
                placeholder="Search by name"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="form-group">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={filters.city}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="form-group">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                <option value="School">School</option>
                <option value="College">College</option>
                <option value="University">University</option>
                <option value="Coaching Center">Coaching Center</option>
                <option value="Preschool">Preschool</option>
                <option value="Vocational Training">Vocational Training</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <input
                type="text"
                name="board"
                placeholder="Board/Affiliation"
                value={filters.board}
                onChange={handleFilterChange}
              />
            </div>
            
            <button className="btn btn-secondary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      <div className="institutes-section">
        {loading ? (
          <p>Loading institutes...</p>
        ) : filteredInstitutes.length > 0 ? (
          <div className="institutes-grid">
            {filteredInstitutes.map(institute => (
              <div key={institute._id} className="institute-card">
                <div className="institute-image">
                  {/* --- KEY FIX IS HERE --- */}
                  {/* 1. Use the environment variable for the base URL */}
                  {/* 2. Access the logo via institute.media.logo */}
                  {/* 3. Add checks to prevent errors if data is missing */}
                  {institute.media && institute.media.logo ? (
                    <img src={`${process.env.REACT_APP_API_URL}/uploads/${institute.media.logo}`} alt={institute.name} />
                  ) : (
                    <div className="placeholder-image">
                      <i className="fas fa-university"></i>
                    </div>
                  )}
                </div>
                
                <div className="institute-content">
                  <div className="institute-header">
                    <h3>{institute.name}</h3>
                    <span className="badge badge-info">{institute.category}</span>
                  </div>
                  
                  <div className="institute-info">
                    <p><i className="fas fa-map-marker-alt"></i> {institute.city}, {institute.state}</p>
                    {institute.affiliation && (
                      <p><i className="fas fa-certificate"></i> {institute.affiliation}</p>
                    )}
                  </div>
                  
                  <div className="institute-footer">
                    <Link to={`/institutes/${institute._id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No institutes found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstituteList;