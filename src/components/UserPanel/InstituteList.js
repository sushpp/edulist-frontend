import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { instituteService } from "../../services/institute";
import "./UserPanel.css";

const InstituteList = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    city: "",
    minFees: "",
    maxFees: "",
    facilities: "",
    rating: "",
  });

  const fetchInstitutes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await instituteService.getAllInstitutes(filters);
      const arr = Array.isArray(data.institutes) ? data.institutes : [];
      setInstitutes(arr);
    } catch (err) {
      console.error("Error fetching institutes:", err);
      setError(err.message || "Failed to fetch institutes");
      setInstitutes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutes();
  }, [filters]);

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () =>
    setFilters({
      category: "",
      city: "",
      minFees: "",
      maxFees: "",
      facilities: "",
      rating: "",
    });

  const getAverageRating = (inst) => {
    if (!Array.isArray(inst.reviews) || inst.reviews.length === 0) return 0;
    const sum = inst.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / inst.reviews.length).toFixed(1);
  };

  const getPrimaryImage = (inst) => {
    if (!Array.isArray(inst.images) || inst.images.length === 0) return null;
    return inst.images.find((img) => img.isPrimary) || inst.images[0];
  };

  const getImageUrl = (image) => (image?.url || "").replace("http://", "https://");

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
          <button onClick={clearFilters} className="clear-filters">
            Clear All
          </button>
        </div>
        {/* Filters grid omitted for brevity */}
      </div>

      {/* Institutes Grid */}
      <div className="institutes-grid">
        {loading ? (
          <div>Loading institutes...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : institutes.length === 0 ? (
          <div>No institutes found.</div>
        ) : (
          institutes.map((inst) => {
            const primaryImage = getPrimaryImage(inst);
            const imageUrl = getImageUrl(primaryImage);
            const logoUrl = getImageUrl(inst.logo);
            return (
              <div key={inst._id} className="institute-card">
                <div className="card-image">
                  {imageUrl && <img src={imageUrl} alt={inst.name} />}
                  <div className="image-placeholder">
                    {logoUrl ? <img src={logoUrl} alt="logo" /> : inst.name?.charAt(0)?.toUpperCase() || "I"}
                  </div>
                  <div className="card-badge">
                    <span>⭐ {getAverageRating(inst)}</span>
                    <span>({inst.reviews?.length || 0} reviews)</span>
                  </div>
                </div>
                <div className="card-content">
                  <h3>{inst.name || "Unnamed Institute"}</h3>
                  <p>{inst.category || "Unknown Category"}</p>
                  <p>📍 {inst.address?.city || "Unknown City"}</p>
                  <p>{inst.description?.substring(0, 100) || "No description"}</p>
                  <Link to={`/institute/${inst._id}`} className="btn btn-primary">
                    View Details
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
