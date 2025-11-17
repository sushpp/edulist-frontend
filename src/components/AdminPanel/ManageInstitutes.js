import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import api from '../../services/api';
import './AdminPanel.css';

const ManageInstitutes = () => {
  const [institutes, setInstitutes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const res = await api.get('/admin/institutes');
        setInstitutes(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInstitutes();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setLoading(true);
    setAlert(null);

    try {
      const res = await api.put(`/admin/institutes/${id}`, { status });
      setInstitutes(institutes.map(institute => 
        institute._id === id ? res.data : institute
      ));
      setAlert({ type: 'success', message: `Institute ${status} successfully!` });
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to update institute status' });
    } finally {
      setLoading(false);
    }
  };

  const filteredInstitutes = filter === 'all' 
    ? institutes 
    : institutes.filter(institute => institute.verifiedStatus === filter);

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Manage Institutes</h1>
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({institutes.length})
            </button>
            <button 
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({institutes.filter(i => i.verifiedStatus === 'pending').length})
            </button>
            <button 
              className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              Approved ({institutes.filter(i => i.verifiedStatus === 'approved').length})
            </button>
            <button 
              className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              Rejected ({institutes.filter(i => i.verifiedStatus === 'rejected').length})
            </button>
          </div>
        </div>
        
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}
        
        <div className="table-container">
          <div className="table-header">
            <h2>Institutes</h2>
            <div className="table-actions">
              <span>{filteredInstitutes.length} institutes</span>
            </div>
          </div>
          
          {filteredInstitutes.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Institute</th>
                  <th>Category</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstitutes.map(institute => (
                  <tr key={institute._id}>
                    <td>
                      <div className="institute-info">
                        <strong>{institute.name}</strong>
                        <div className="institute-meta">
                          <span>By: {institute.userId?.name}</span>
                          <span>{institute.userId?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{institute.category}</td>
                    <td>
                      <div className="contact-info">
                        <div>{institute.contactInfo}</div>
                        <div>{institute.userId?.phone}</div>
                      </div>
                    </td>
                    <td>{institute.city}, {institute.state}</td>
                    <td>{new Date(institute.createdDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${institute.verifiedStatus}`}>
                        {institute.verifiedStatus}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        {institute.verifiedStatus === 'pending' && (
                          <>
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => handleStatusUpdate(institute._id, 'approved')}
                              disabled={loading}
                            >
                              <i className="fas fa-check"></i> Approve
                            </button>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleStatusUpdate(institute._id, 'rejected')}
                              disabled={loading}
                            >
                              <i className="fas fa-times"></i> Reject
                            </button>
                          </>
                        )}
                        {institute.verifiedStatus === 'approved' && (
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleStatusUpdate(institute._id, 'rejected')}
                            disabled={loading}
                          >
                            <i className="fas fa-times"></i> Reject
                          </button>
                        )}
                        {institute.verifiedStatus === 'rejected' && (
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={() => handleStatusUpdate(institute._id, 'approved')}
                            disabled={loading}
                          >
                            <i className="fas fa-check"></i> Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">
              <h3>No institutes found</h3>
              <p>
                {filter === 'all' 
                  ? 'No institutes have registered yet' 
                  : `No ${filter} institutes found`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageInstitutes;