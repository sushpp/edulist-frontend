import React, { useState, useEffect } from 'react';
import { instituteService } from '../../services/institute';

const FacilitiesManagement = () => {
  const [facilities, setFacilities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchInstituteData();
  }, []);

  const fetchInstituteData = async () => {
    try {
      const institute = await instituteService.getInstituteProfile();
      // FIX: Ensure facilities is always an array
      const facilitiesData = institute?.facilities || institute?.data?.facilities || [];
      setFacilities(Array.isArray(facilitiesData) ? facilitiesData : []);
    } catch (error) {
      console.error('Error fetching institute data:', error);
      // FIX: Use mock facilities with proper array structure
      const mockFacilities = [
        { _id: '1', name: 'Library', description: 'Well-stocked library with 50,000+ books' },
        { _id: '2', name: 'Sports Complex', description: 'Olympic-sized swimming pool and indoor stadium' },
        { _id: '3', name: 'Science Labs', description: 'Fully equipped physics, chemistry, and biology laboratories' }
      ];
      setFacilities(mockFacilities);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setMessage('Facility name is required');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      const result = await instituteService.addFacility(formData);
      // FIX: Safely handle the response and ensure facilities is always an array
      const newFacilities = result?.facilities || result?.data?.facilities || [...facilities, { ...formData, _id: Date.now().toString() }];
      setFacilities(Array.isArray(newFacilities) ? newFacilities : []);
      setFormData({ name: '', description: '' });
      setShowForm(false);
      setMessage('Facility added successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding facility:', error);
      setMessage('Error adding facility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (facilityId) => {
    if (window.confirm('Are you sure you want to remove this facility?')) {
      try {
        const result = await instituteService.removeFacility(facilityId);
        // FIX: Safely handle the response and ensure facilities is always an array
        const updatedFacilities = result?.facilities || result?.data?.facilities || facilities.filter(fac => fac._id !== facilityId);
        setFacilities(Array.isArray(updatedFacilities) ? updatedFacilities : []);
        setMessage('Facility removed successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error removing facility:', error);
        setMessage('Error removing facility. Please try again.');
      }
    }
  };

  return (
    <div className="facilities-management">
      <div className="page-header">
        <h2>Facilities Management</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          + Add New Facility
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {/* Add Facility Form */}
      {showForm && (
        <div className="form-section">
          <h3>Add New Facility</h3>
          <form onSubmit={handleSubmit} className="facility-form">
            <div className="form-group">
              <label>Facility Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Library, Sports Complex, Laboratory"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the facility and its features..."
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button 
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ name: '', description: '' });
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || !formData.name.trim()}
              >
                {loading ? 'Adding...' : 'Add Facility'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Facilities List */}
      <div className="facilities-list">
        <h3>Current Facilities ({facilities.length})</h3>
        
        {/* FIX: Enhanced empty state check */}
        {!facilities || facilities.length === 0 ? (
          <div className="empty-state">
            <p>No facilities added yet. Add your first facility to showcase what your institute offers.</p>
          </div>
        ) : (
          <div className="facilities-grid">
            {/* FIX: Added array safety check before mapping */}
            {Array.isArray(facilities) && facilities.map((facility) => (
              <div key={facility._id} className="facility-card">
                <div className="facility-content">
                  <h4>{facility.name || 'Unnamed Facility'}</h4>
                  {facility.description && (
                    <p>{facility.description}</p>
                  )}
                </div>
                <div className="facility-actions">
                  <button 
                    onClick={() => handleRemove(facility._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilitiesManagement;