import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/admin';

const ManageInstitutes = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    setLoading(true);
    try {
      const data = await adminService.getPendingInstitutes();
      // Ensure array
      setInstitutes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching institutes:', err);
      setInstitutes([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await adminService.updateInstituteStatus(id, status);
      setInstitutes(prev => (Array.isArray(prev) ? prev.filter(i => i._id !== id) : []));
      alert(`Institute ${status} successfully`);
    } catch (err) {
      console.error('Error updating institute status:', err);
      alert('Error updating institute status');
    }
  };

  if (loading) return <div className="loading">Loading institutes...</div>;

  if (!Array.isArray(institutes) || institutes.length === 0)
    return <p>No pending institutes</p>;

  return (
    <div className="manage-institutes">
      <h2>Manage Institutes</h2>

      {institutes.map(inst => (
        <div key={inst._id || inst.id} className="institute-card">
          <h3>{inst.name || 'Unnamed Institute'}</h3>
          <p>Category: {inst.category || 'Not specified'}</p>
          <p>Affiliation: {inst.affiliation || 'Not specified'}</p>
          <p>Contact: {inst.contact?.email || 'No email'} | {inst.contact?.phone || 'No phone'}</p>
          <p>
            Address: {inst.address?.city || 'Unknown'}, {inst.address?.state || 'Unknown'}
          </p>
          <p>Registered by: {inst.user?.name || 'Unknown'} ({inst.user?.email || 'No email'})</p>
          <p>Registration Date: {inst.createdAt ? new Date(inst.createdAt).toLocaleDateString() : 'Unknown'}</p>
          <div className="actions">
            <button onClick={() => updateStatus(inst._id, 'approved')}>Approve</button>
            <button onClick={() => updateStatus(inst._id, 'rejected')}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageInstitutes;
