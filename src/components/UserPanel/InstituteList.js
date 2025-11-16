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

  const fetchInstitutes = async () => {
    setLoading(true);
    try {
      const data = await instituteService.getAllInstitutes(filters);
      setInstitutes(data.institutes);
    } catch (err) {
      setError(err.message || 'Failed to fetch institutes');
      setInstitutes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInstitutes(); }, [filters]);

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({ category: '', city: '', minFees: '', maxFees: '', facilities: '', rating: '' });

  return (
    <div className="institute-list-page">
      <div className="page-header"><h1>Find Institutes</h1></div>

      <div className="filters-section">
        <button onClick={clearFilters}>Clear Filters</button>
      </div>

      <div className="institutes-grid">
        {loading ? <p>Loading...</p> :
         error ? <p>{error}</p> :
         institutes.length === 0 ? <p>No institutes found</p> :
         institutes.map(inst => (
           <div key={inst._id} className="institute-card">
             <h3>{inst.name || 'Unnamed Institute'}</h3>
             <p>{inst.category}</p>
             <Link to={`/institute/${inst._id}`}>View Details</Link>
           </div>
         ))}
      </div>
    </div>
  );
};

export default InstituteList;
