import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';

const ManageInstitutes = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    try {
      const data = await adminService.getPendingInstitutes();
      setInstitutes(data);
    } catch (error) {
      console.error('Error fetching institutes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (instituteId, status) => {
    try {
      await adminService.updateInstituteStatus(instituteId, status);
      setInstitutes(institutes.filter(inst => inst._id !== instituteId));
      alert(`Institute ${status} successfully`);
    } catch (error) {
      console.error('Error updating institute status:', error);
      alert('Error updating institute status');
    }
  };

  if (loading) {
    return <div className="loading">Loading institutes...</div>;
  }

  return (
    <div className="manage-institutes">
      <div className="page-header">
        <h2>Manage Institutes</h2>
        <p>Approve or reject institute registration requests</p>
      </div>

      <div className="institutes-list">
        {institutes.length === 0 ? (
          <div className="empty-state">
            <p>No institutes pending approval</p>
          </div>
        ) : (
          institutes.map(institute => (
            <div key={institute._id} className="institute-card">
              <div className="institute-header">
                <h3>{institute.name}</h3>
                <span className={`status-badge ${institute.status}`}>
                  {institute.status}
                </span>
              </div>
              
              <div className="institute-details">
                <div className="detail-row">
                  <span className="label">Category:</span>
                  <span className="value">{institute.category}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Affiliation:</span>
                  <span className="value">{institute.affiliation}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Contact:</span>
                  <span className="value">{institute.contact?.email} | {institute.contact?.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Address:</span>
                  <span className="value">
                    {institute.address?.city}, {institute.address?.state}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Description:</span>
                  <span className="value">{institute.description}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Registered by:</span>
                  <span className="value">
                    {institute.user?.name} ({institute.user?.email})
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Registration Date:</span>
                  <span className="value">
                    {new Date(institute.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="institute-actions">
                <button
                  onClick={() => handleStatusUpdate(institute._id, 'approved')}
                  className="btn btn-success"
                >
                  Approve Institute
                </button>
                <button
                  onClick={() => handleStatusUpdate(institute._id, 'rejected')}
                  className="btn btn-danger"
                >
                  Reject Institute
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageInstitutes;