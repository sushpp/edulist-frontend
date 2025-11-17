import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';

const ManageInstitutes = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({}); // Track loading state for individual actions

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getPendingInstitutes();
      
      // Enhanced safety check with multiple fallbacks
      const institutesData = Array.isArray(data) ? data : 
                           data?.institutes ? data.institutes : 
                           data?.data ? data.data : [];
      
      setInstitutes(institutesData);
    } catch (error) {
      console.error('Error fetching institutes:', error);
      setError('Failed to fetch institutes. Please try again later.');
      // Set empty array on error to prevent crashes
      setInstitutes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (instituteId, status) => {
    try {
      // Set loading state for this specific action
      setActionLoading(prev => ({ ...prev, [instituteId]: true }));
      
      await adminService.updateInstituteStatus(instituteId, status);
      
      // Filter out the updated institute from the list
      setInstitutes(prevInstitutes => 
        Array.isArray(prevInstitutes) 
          ? prevInstitutes.filter(inst => inst._id !== instituteId)
          : []
      );
      
      alert(`Institute ${status} successfully`);
    } catch (error) {
      console.error('Error updating institute status:', error);
      alert('Error updating institute status');
    } finally {
      // Clear loading state for this action
      setActionLoading(prev => ({ ...prev, [instituteId]: false }));
    }
  };

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return 'Invalid date';
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

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchInstitutes} className="btn btn-primary">Retry</button>
        </div>
      )}

      <div className="institutes-list">
        {/* Enhanced safety check before rendering */}
        {!institutes || !Array.isArray(institutes) || institutes.length === 0 ? (
          <div className="empty-state">
            <p>No institutes pending approval</p>
          </div>
        ) : (
          institutes.map(institute => (
            <div key={institute._id || institute.id || Math.random().toString(36).substr(2, 9)} className="institute-card">
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
                  <span className="value">{formatDate(institute.createdAt)}</span>
                </div>
              </div>

              <div className="institute-actions">
                <button
                  onClick={() => handleStatusUpdate(institute._id, 'approved')}
                  className="btn btn-success"
                  disabled={actionLoading[institute._id]}
                >
                  {actionLoading[institute._id] ? 'Processing...' : 'Approve Institute'}
                </button>
                <button
                  onClick={() => handleStatusUpdate(institute._id, 'rejected')}
                  className="btn btn-danger"
                  disabled={actionLoading[institute._id]}
                >
                  {actionLoading[institute._id] ? 'Processing...' : 'Reject Institute'}
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