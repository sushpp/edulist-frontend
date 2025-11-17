import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import UserSidebar from './UserSidebar';
import api from '../../services/api';
import './UserPanel.css';

const UserEnquiries = () => {
  const { user } = useContext(AuthContext);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await api.get('/enquiries');
        setEnquiries(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  if (loading) {
    return <div className="loading">Loading enquiries...</div>;
  }

  return (
    <div className="dashboard-layout">
      <UserSidebar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>My Enquiries</h1>
          <div className="table-actions">
            <span>{enquiries.length} total enquiries</span>
          </div>
        </div>
        
        <div className="table-container">
          <div className="table-header">
            <h2>All Enquiries</h2>
          </div>
          
          {enquiries.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Institute</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map(enquiry => (
                  <tr key={enquiry._id}>
                    <td>
                      <div className="institute-info">
                        <strong>{enquiry.instituteId?.name}</strong>
                        <div className="institute-meta">
                          {enquiry.instituteId?.city}, {enquiry.instituteId?.state}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="message-text">
                        {enquiry.message.substring(0, 100)}
                        {enquiry.message.length > 100 && '...'}
                      </div>
                    </td>
                    <td>{new Date(enquiry.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${enquiry.status}`}>
                        {enquiry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">
              <h3>No enquiries yet</h3>
              <p>Send enquiries to institutes to see them here</p>
              <a href="/institutes" className="btn btn-primary mt-2">
                Browse Institutes
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserEnquiries;