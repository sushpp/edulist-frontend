import React, { useState, useEffect } from 'react';
import { enquiryService } from '../../services/enquiry';

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const data = await enquiryService.getInstituteEnquiries();
      // FIX: Ensure enquiries is always an array with multiple fallbacks
      const enquiriesData = Array.isArray(data) ? data : 
                           data?.enquiries ? data.enquiries : 
                           data?.data ? data.data : [];
      setEnquiries(enquiriesData);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      // FIX: Set empty array on error to prevent crashes
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (enquiryId, status) => {
    try {
      await enquiryService.updateEnquiryStatus(enquiryId, status);
      fetchEnquiries(); // Refresh list
    } catch (error) {
      console.error('Error updating enquiry status:', error);
      alert('Error updating enquiry status');
    }
  };

  const handleRespond = async (enquiryId) => {
    if (!responseText.trim()) return;

    try {
      await enquiryService.respondToEnquiry(enquiryId, responseText);
      setSelectedEnquiry(null);
      setResponseText('');
      fetchEnquiries(); // Refresh list
      alert('Response sent successfully!');
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Error sending response');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { class: 'new', label: 'New' },
      contacted: { class: 'contacted', label: 'Contacted' },
      resolved: { class: 'resolved', label: 'Resolved' }
    };
    
    const config = statusConfig[status] || statusConfig.new;
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  if (loading) {
    return <div className="loading">Loading enquiries...</div>;
  }

  return (
    <div className="enquiries-management">
      <div className="page-header">
        <h2>Student Enquiries</h2>
        <p>Manage and respond to student and parent enquiries</p>
      </div>

      {/* Enquiries List */}
      <div className="enquiries-list">
        {/* FIX: Enhanced empty state check */}
        {!enquiries || enquiries.length === 0 ? (
          <div className="empty-state">
            <p>No enquiries received yet</p>
          </div>
        ) : (
          <div className="enquiries-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* FIX: Added array safety check before mapping */}
                {Array.isArray(enquiries) && enquiries.map(enquiry => (
                  <tr key={enquiry._id || enquiry.id}>
                    <td>
                      <div className="user-info">
                        <strong>{enquiry.name || 'Unknown'}</strong>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div>{enquiry.email || 'No email'}</div>
                        <div>{enquiry.phone || 'No phone'}</div>
                      </div>
                    </td>
                    <td>
                      <div className="message-preview">
                        {/* FIX: Added safety check for message */}
                        {enquiry.message ? `${enquiry.message.substring(0, 50)}...` : 'No message'}
                      </div>
                    </td>
                    <td>
                      {/* FIX: Added safety check for date */}
                      {enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : 'Unknown date'}
                    </td>
                    <td>
                      {getStatusBadge(enquiry.status)}
                    </td>
                    <td>
                      <div className="enquiry-actions">
                        <button
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="btn btn-sm btn-primary"
                        >
                          View & Respond
                        </button>
                        {enquiry.status === 'new' && (
                          <button
                            onClick={() => handleStatusUpdate(enquiry._id, 'contacted')}
                            className="btn btn-sm btn-outline"
                          >
                            Mark Contacted
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {selectedEnquiry && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Respond to Enquiry</h3>
              <button 
                onClick={() => {
                  setSelectedEnquiry(null);
                  setResponseText('');
                }}
                className="close-button"
              >
                ×
              </button>
            </div>

            <div className="enquiry-details">
              <div className="detail-section">
                <h4>Enquiry Details</h4>
                <p><strong>From:</strong> {selectedEnquiry.name || 'Unknown'}</p>
                <p><strong>Email:</strong> {selectedEnquiry.email || 'No email'}</p>
                <p><strong>Phone:</strong> {selectedEnquiry.phone || 'No phone'}</p>
                <p><strong>Message:</strong> {selectedEnquiry.message || 'No message'}</p>
                <p><strong>Received:</strong> {selectedEnquiry.createdAt ? new Date(selectedEnquiry.createdAt).toLocaleString() : 'Unknown date'}</p>
              </div>

              {/* FIX: Added safety check for response */}
              {selectedEnquiry.response && (
                <div className="detail-section">
                  <h4>Previous Response</h4>
                  <p>{selectedEnquiry.response}</p>
                </div>
              )}

              <div className="response-section">
                <h4>Your Response</h4>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response here..."
                  rows="6"
                />
              </div>

              <div className="form-actions">
                <button
                  onClick={() => {
                    setSelectedEnquiry(null);
                    setResponseText('');
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRespond(selectedEnquiry._id)}
                  className="btn btn-primary"
                  disabled={!responseText.trim()}
                >
                  Send Response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiries;