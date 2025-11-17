import React, { useState } from 'react';
import api from '../../services/api';
import './UserPanel.css';

const EnquiryForm = ({ instituteId, instituteName, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    message: '',
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const { message } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      await api.post('/enquiries', {
        instituteId,
        message,
      });
      
      setAlert({ type: 'success', message: 'Enquiry sent successfully!' });
      onSubmit(formData);
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.msg || 'Failed to send enquiry' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Send Enquiry to {instituteName}</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body">
          {alert && (
            <div className={`alert alert-${alert.type}`}>
              {alert.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={onChange}
                rows="5"
                placeholder="Ask any questions you have about this institute..."
                required
              ></textarea>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Enquiry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnquiryForm;