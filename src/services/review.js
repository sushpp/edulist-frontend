import api from './api';

export const reviewService = {
  createReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  getInstituteReviews: async (instituteId) => {
    try {
      const response = await api.get(`/reviews/institute/${instituteId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching institute reviews:', error);
      throw error;
    }
  },

  getUserReviews: async () => {
    try {
      const response = await api.get('/reviews/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  },

  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
};