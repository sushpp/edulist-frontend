// src/services/institute.js
import api from './api';

export const instituteService = {
  getAllInstitutes: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      
      const requestUrl = `/institutes/public?${params}`;
      const response = await api.get(requestUrl);
      const data = response.data;
      
      // Normalize response to ensure it always has the expected structure
      if (Array.isArray(data)) return { institutes: data };
      if (data && Array.isArray(data.institutes)) return data;
      if (data && data.data && Array.isArray(data.data)) return { institutes: data.data };
      
      console.warn('Unexpected API response format. Returning empty array.');
      return { institutes: [] };
    } catch (error) {
      console.error('Error fetching institutes:', error);
      
      // === SPECIFIC TIMEOUT ERROR HANDLING ===
      // Check for the specific Axios timeout error code
      if (error.code === 'ECONNABORTED') {
        throw new Error('The server is taking too long to respond. Please try again.');
      }
      
      // Check for other network errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      
      const errorMessage = error.response?.data?.message || 'Failed to fetch institutes';
      throw new Error(errorMessage);
    }
  },

  // ... all your other methods are correct, keep them as is.
  getInstituteById: async (id) => {
    try {
      const response = await api.get(`/institutes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching institute:', error);
      if (error.response?.status === 404) {
        throw new Error('Institute not found');
      }
      const errorMessage = error.response?.data?.message || 'Failed to fetch institute details';
      throw new Error(errorMessage);
    }
  },

  getInstituteProfile: async () => {
    try {
      const response = await api.get('/institutes/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching institute profile:', error);
      if (error.response?.status === 401) {
        throw new Error('Please login to access your institute profile.');
      }
      const errorMessage = error.response?.data?.message || 'Failed to fetch institute profile';
      throw new Error(errorMessage);
    }
  },

  updateInstitute: async (data) => {
    try {
      const response = await api.put('/institutes/profile', data);
      return response.data;
    } catch (error) {
      console.error('Error updating institute:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update institute profile';
      throw new Error(errorMessage);
    }
  },

  addFacility: async (facility) => {
    try {
      const response = await api.post('/institutes/facilities', facility);
      return response.data;
    } catch (error) {
      console.error('Error adding facility:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add facility';
      throw new Error(errorMessage);
    }
  },

  removeFacility: async (facilityId) => {
    try {
      const response = await api.delete(`/institutes/facilities/${facilityId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing facility:', error);
      const errorMessage = error.response?.data?.message || 'Failed to remove facility';
      throw new Error(errorMessage);
    }
  }
};