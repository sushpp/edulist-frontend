import api from './api';

export const reviewService = {
  createReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      // FIX: Normalize response format
      const data = response.data;
      console.log('🔍 Create Review API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating review:', error);
      throw error;
    }
  },

  getInstituteReviews: async (instituteId) => {
    try {
      const response = await api.get(`/reviews/institute/${instituteId}`);
      const data = response.data;
      
      // FIX: Enhanced response normalization with multiple fallbacks
      console.log('🔍 Institute Reviews API Response:', data);
      
      if (Array.isArray(data)) {
        console.log('📦 API returned direct array');
        return data;
      } else if (data && Array.isArray(data.reviews)) {
        console.log('📦 API returned { reviews: array }');
        return data.reviews;
      } else if (data && data.data && Array.isArray(data.data)) {
        console.log('📦 API returned { data: array }');
        return data.data;
      } else if (data && data.data && Array.isArray(data.data.reviews)) {
        console.log('📦 API returned { data: { reviews: array } }');
        return data.data.reviews;
      } else if (data && typeof data === 'object') {
        // Try to find any array property in the response
        const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]));
        if (arrayKeys.length > 0) {
          console.log(`📦 Found array in property: ${arrayKeys[0]}`);
          return data[arrayKeys[0]];
        }
      }
      
      // If no array found, return empty array to prevent .map() errors
      console.warn('❌ Unexpected API response format for institute reviews. No array found. Returning empty array.');
      console.warn('Response structure:', typeof data, data);
      return [];
      
    } catch (error) {
      console.error('❌ Error fetching institute reviews:', error);
      // FIX: Return empty array on error to prevent crashes
      return [];
    }
  },

  getUserReviews: async () => {
    try {
      const response = await api.get('/reviews/user');
      const data = response.data;
      
      // FIX: Enhanced response normalization with multiple fallbacks
      console.log('🔍 User Reviews API Response:', data);
      
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.reviews)) {
        return data.reviews;
      } else if (data && data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data && data.data && Array.isArray(data.data.reviews)) {
        return data.data.reviews;
      } else if (data && typeof data === 'object') {
        // Try to find any array property in the response
        const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]));
        if (arrayKeys.length > 0) {
          return data[arrayKeys[0]];
        }
      }
      
      console.warn('❌ Unexpected API response format for user reviews. Returning empty array.');
      return [];
      
    } catch (error) {
      console.error('❌ Error fetching user reviews:', error);
      // FIX: Return empty array on error to prevent crashes
      return [];
    }
  },

  // FIX: Added method to get all reviews (for admin panel)
  getAllReviews: async () => {
    try {
      const response = await api.get('/reviews');
      const data = response.data;
      
      // FIX: Enhanced response normalization
      console.log('🔍 All Reviews API Response:', data);
      
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.reviews)) {
        return data.reviews;
      } else if (data && data.data && Array.isArray(data.data)) {
        return data.data;
      } else {
        console.warn('❌ Unexpected API response format for all reviews. Returning empty array.');
        return [];
      }
      
    } catch (error) {
      console.error('❌ Error fetching all reviews:', error);
      return [];
    }
  },

  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      // FIX: Normalize response format
      const data = response.data;
      console.log('🔍 Update Review API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error updating review:', error);
      throw error;
    }
  },

  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      // FIX: Normalize response format
      const data = response.data;
      console.log('🔍 Delete Review API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error deleting review:', error);
      throw error;
    }
  },

  // FIX: Added method to get review by ID
  getReviewById: async (reviewId) => {
    try {
      const response = await api.get(`/reviews/${reviewId}`);
      const data = response.data;
      console.log('🔍 Review by ID API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching review by ID:', error);
      throw error;
    }
  },

  // FIX: Added method to update review status (for admin)
  updateReviewStatus: async (reviewId, status) => {
    try {
      const response = await api.put(`/reviews/${reviewId}/status`, { status });
      const data = response.data;
      console.log('🔍 Update Review Status API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error updating review status:', error);
      throw error;
    }
  },

  // FIX: Added test method to check API response format
  testApiResponse: async (endpoint = '/reviews/institute/sample-id') => {
    try {
      // Use a test endpoint or the actual one
      const response = await api.get(endpoint);
      console.log('🧪 TEST - Raw Review API Response:', response);
      console.log('🧪 TEST - Response Data:', response.data);
      console.log('🧪 TEST - Data Type:', typeof response.data);
      console.log('🧪 TEST - Is Array?:', Array.isArray(response.data));
      
      if (response.data && typeof response.data === 'object') {
        console.log('🧪 TEST - Object Keys:', Object.keys(response.data));
        Object.keys(response.data).forEach(key => {
          console.log(`🧪 TEST - Key "${key}":`, typeof response.data[key], Array.isArray(response.data[key]));
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('🧪 TEST - Error:', error);
      throw error;
    }
  }
};