import React, { useState, useEffect } from 'react';
import InstituteSidebar from './InstituteSidebar';
import api from '../../services/api';
import './InstituteDashboard.css';

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await api.get('/facilities');
        setFacilities(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFacilities();
  }, []);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      let res;
      if (editingFacility) {
        res = await api.put(`/facilities/${editingFacility._id}`, formData);
      } else {
        res = await api.post('/facilities', formData);
      }

      if (editingFacility) {
        setFacilities(facilities.map(facility => 
          facility._id === editingFacility._id ? res.data : facility
        ));
      } else {
        setFacilities([...facilities, res.data]);
      }

      setAlert({ type: 'success', message: `Facility ${editingFacility ? 'updated' : 'added'} successfully!` });
      resetForm();
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.msg || `Failed to ${editingFacility ? 'update' : 'add'} facility` });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = facility => {
    setEditingFacility(facility);
    setFormData({
      name: facility.name,
      description: facility.description,
    });
    setShowAddForm(true);
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this facility?')) {
      try {
        await api.delete(`/facilities/${id}`);
        setFacilities(facilities.filter(facility => facility._id !== id));
        setAlert({ type: 'success', message: 'Facility deleted successfully!' });
      } catch (err) {
        setAlert({ type: 'danger', message: 'Failed to delete facility' });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
    });
    setEditingFacility(null);
    setShowAddForm(false);
  };

  return (
    <div className="dashboard-layout">
      <InstituteSidebar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Facilities</h1>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowAddForm(true)}
          >
            <i className="fas fa-plus"></i> Add New Facility
          </button>
        </div>
        
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}
        
        {showAddForm && (
          <div className="form-section">
            <h2>{editingFacility ? 'Edit Facility' : 'Add New Facility'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Facility Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={onChange}
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div className="btn-group">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingFacility ? 'Update Facility' : 'Add Facility')}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="table-container">
          <div className="table-header">
            <h2>All Facilities</h2>
            <div className="table-actions">
              <span>{facilities.length} facilities</span>
            </div>
          </div>
          
          {facilities.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map(facility => (
                  <tr key={facility._id}>
                    <td>{facility.name}</td>
                    <td>{facility.description}</td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEdit(facility)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(facility._id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">
              <h3>No facilities yet</h3>
              <p>Add your first facility to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Facilities;