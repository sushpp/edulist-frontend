import React, { useState } from 'react';
import api from '../../services/api';
import './UserPanel.css';

const ReviewForm = ({ instituteId, instituteName, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    reviewText: '',
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const { rating, reviewText } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      await api.post('/reviews', {
        instituteId,
        rating,
        reviewText,
      });
      
      setAlert({ type: 'success', message: 'Review submitted successfully!' });
      onSubmit(formData);
    } catch (err) {
      setAlert({ type: 'danger', message: err.response?.data?.msg || 'Failed to submit review' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Review {instituteName}</h2>
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
              <label htmlFor="rating">Rating</label>
              <div className="rating-input">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`rating-star ${i < rating ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, rating: i + 1 })}
                  >
                    <i className="fas fa-star"></i>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="reviewText">Your Review</label>
              <textarea
                id="reviewText"
                name="reviewText"
                value={reviewText}
                onChange={onChange}
                rows="5"
                placeholder="Share your experience with this institute..."
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
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;