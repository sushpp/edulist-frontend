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
      // FIX: Ensure institutes is always an array with multiple fallbacks
      const institutesData = Array.isArray(data) ? data : 
                           data?.institutes ? data.institutes : 
                           data?.data ? data.data : [];
      setInstitutes(institutesData);
    } catch (error) {
      console.error('Error fetching institutes:', error);
      // FIX: Set empty array on error to prevent crashes
      setInstitutes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (instituteId, status) => {
    try {
      await adminService.updateInstituteStatus(instituteId, status);
      // FIX: Added array safety check before filtering
      setInstitutes(prevInstitutes => 
        Array.isArray(prevInstitutes) 
          ? prevInstitutes.filter(inst => inst._id !== instituteId)
          : []
      );
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
        {/* FIX: Enhanced empty state check */}
        {!institutes || !Array.isArray(institutes) || institutes.length === 0 ? (
          <div className="empty-state">
            <p>No institutes pending approval</p>
          </div>
        ) : (
          // FIX: Added array safety check before mapping
          Array.isArray(institutes) && institutes.map(institute => (
            <div key={institute._id || institute.id} className="institute-card">
              <div className="institute-header">
                <h3>{institute.name || 'Unnamed Institute'}</h3>
                <span className={`status-badge ${institute.status || 'pending'}`}>
                  {institute.status || 'pending'}
                </span>
              </div>
              
              <div className="institute-details">
                <div className="detail-row">
                  <span className="label">Category:</span>
                  <span className="value">{institute.category || 'Not specified'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Affiliation:</span>
                  <span className="value">{institute.affiliation || 'Not specified'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Contact:</span>
                  <span className="value">
                    {institute.contact?.email || 'No email'} | {institute.contact?.phone || 'No phone'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Address:</span>
                  <span className="value">
                    {institute.address?.city || 'Unknown city'}, {institute.address?.state || 'Unknown state'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Description:</span>
                  <span className="value">{institute.description || 'No description provided'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Registered by:</span>
                  <span className="value">
                    {institute.user?.name || 'Unknown user'} ({institute.user?.email || 'No email'})
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Registration Date:</span>
                  <span className="value">
                    {/* FIX: Added safety check for date */}
                    {institute.createdAt ? new Date(institute.createdAt).toLocaleDateString() : 'Unknown date'}
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