import React, { useState, useEffect } from 'react';
import InstituteSidebar from './InstituteSidebar';
import api from '../../services/api';
import './InstituteDashboard.css';

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await api.get('/enquiries');
        setEnquiries(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEnquiries();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setLoading(true);
    setAlert(null);

    try {
      const res = await api.put(`/enquiries/${id}`, { status });
      setEnquiries(enquiries.map(enquiry => 
        enquiry._id === id ? res.data : enquiry
      ));
      setAlert({ type: 'success', message: 'Enquiry status updated successfully!' });
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to update enquiry status' });
    } finally {
      setLoading(false);
    }
  };

  const viewEnquiry = (enquiry) => {
    setSelectedEnquiry(enquiry);
  };

  const closeEnquiry = () => {
    setSelectedEnquiry(null);
  };

  return (
    <div className="dashboard-layout">
      <InstituteSidebar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Enquiries</h1>
          <div className="table-actions">
            <span>{enquiries.length} total enquiries</span>
          </div>
        </div>
        
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}
        
        <div className="table-container">
          <div className="table-header">
            <h2>All Enquiries</h2>
          </div>
          
          {enquiries.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map(enquiry => (
                  <tr key={enquiry._id}>
                    <td>
                      <div className="user-info">
                        <strong>{enquiry.userId?.name}</strong>
                        <div>{enquiry.userId?.email}</div>
                        <div>{enquiry.userId?.phone}</div>
                      </div>
                    </td>
                    <td>
                      <div className="message-preview">
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
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => viewEnquiry(enquiry)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        {enquiry.status === 'pending' && (
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={() => handleStatusUpdate(enquiry._id, 'responded')}
                            disabled={loading}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                        )}
                        {enquiry.status !== 'closed' && (
                          <button 
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleStatusUpdate(enquiry._id, 'closed')}
                            disabled={loading}
                          >
                            <i className="fas fa-times"></i>
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
              <h3>No enquiries yet</h3>
              <p>Enquiries from users will appear here</p>
            </div>
          )}
        </div>
        
        {selectedEnquiry && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Enquiry Details</h2>
                <button className="modal-close" onClick={closeEnquiry}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="modal-body">
                <div className="enquiry-details">
                  <div className="detail-section">
                    <h3>User Information</h3>
                    <p><strong>Name:</strong> {selectedEnquiry.userId?.name}</p>
                    <p><strong>Email:</strong> {selectedEnquiry.userId?.email}</p>
                    <p><strong>Phone:</strong> {selectedEnquiry.userId?.phone}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h3>Message</h3>
                    <p>{selectedEnquiry.message}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h3>Status</h3>
                    <span className={`status-badge ${selectedEnquiry.status}`}>
                      {selectedEnquiry.status}
                    </span>
                  </div>
                  
                  <div className="detail-section">
                    <h3>Date</h3>
                    <p>{new Date(selectedEnquiry.date).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                {selectedEnquiry.status === 'pending' && (
                  <button 
                    className="btn btn-success"
                    onClick={() => {
                      handleStatusUpdate(selectedEnquiry._id, 'responded');
                      closeEnquiry();
                    }}
                    disabled={loading}
                  >
                    Mark as Responded
                  </button>
                )}
                {selectedEnquiry.status !== 'closed' && (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      handleStatusUpdate(selectedEnquiry._id, 'closed');
                      closeEnquiry();
                    }}
                    disabled={loading}
                  >
                    Close Enquiry
                  </button>
                )}
                <button className="btn btn-primary" onClick={closeEnquiry}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Enquiries;