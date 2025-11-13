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
      
      const response = await api.get(`/institutes/public?${params}`);
      const data = response.data;
      
      // === DEBUGGING LOG ===
      // Check your browser's console to see what the API is returning!
      console.log('API Response from getAllInstitutes:', data);
      
      // Normalize the response to ensure it always has the expected structure
      if (Array.isArray(data)) {
        // If the API returned a direct array, wrap it in an object
        return { institutes: data };
      } else if (data && Array.isArray(data.institutes)) {
        // If the API returned the expected object, use it as is
        return data;
      } else if (data && data.data && Array.isArray(data.data)) {
        // Handle case where data is nested in a data property
        return { institutes: data.data };
      } else {
        // If the response is something else, return an empty array to prevent crashes
        console.warn('Unexpected API response format for getAllInstitutes:', data);
        return { institutes: [] };
      }
    } catch (error) {
      console.error('Error fetching institutes:', error);
      
      // Check if it's a network error or server error
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      
      // Use the error message from backend or a generic one
      const errorMessage = error.response?.data?.message || 'Failed to fetch institutes';
      throw new Error(errorMessage);
    }
  },

  // ... other methods remain the same
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
        throw new Error('Please login to access institute profile');
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