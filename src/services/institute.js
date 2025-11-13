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
      
      // FIX: Enhanced response normalization with better debugging
      console.log('🔍 Institute API Response:', data); // Debug log
      
      // Handle various response formats and always return { institutes: array }
      if (Array.isArray(data)) {
        console.log('📦 API returned direct array');
        return { institutes: data };
      } else if (data && Array.isArray(data.institutes)) {
        console.log('📦 API returned { institutes: array }');
        return data;
      } else if (data && data.data && Array.isArray(data.data)) {
        console.log('📦 API returned { data: array }');
        return { institutes: data.data };
      } else if (data && data.data && Array.isArray(data.data.institutes)) {
        console.log('📦 API returned { data: { institutes: array } }');
        return { institutes: data.data.institutes };
      } else if (data && typeof data === 'object') {
        // Try to find any array property in the response
        const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]));
        if (arrayKeys.length > 0) {
          console.log(`📦 Found array in property: ${arrayKeys[0]}`);
          return { institutes: data[arrayKeys[0]] };
        }
      }
      
      // If no array found, return empty array
      console.warn('❌ Unexpected API response format. No array found. Returning empty array.');
      console.warn('Response structure:', typeof data, data);
      return { institutes: [] };
      
    } catch (error) {
      console.error('❌ Error fetching institutes:', error);
      
      // Check for the specific Axios timeout error code
      if (error.code === 'ECONNABORTED') {
        throw new Error('The server is taking too long to respond. Please try again.');
      }
      
      // Check for other network errors (no response from server)
      if (!error.response) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      const errorMessage = error.response?.data?.message || 'Failed to fetch institutes';
      throw new Error(errorMessage);
    }
  },

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
      // FIX: Ensure consistent response format
      const data = response.data;
      console.log('🔍 Institute Profile API Response:', data);
      return data;
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
      // FIX: Ensure consistent response format
      const data = response.data;
      console.log('🔍 Add Facility API Response:', data);
      return data;
    } catch (error) {
      console.error('Error adding facility:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add facility';
      throw new Error(errorMessage);
    }
  },

  removeFacility: async (facilityId) => {
    try {
      const response = await api.delete(`/institutes/facilities/${facilityId}`);
      // FIX: Ensure consistent response format
      const data = response.data;
      console.log('🔍 Remove Facility API Response:', data);
      return data;
    } catch (error) {
      console.error('Error removing facility:', error);
      const errorMessage = error.response?.data?.message || 'Failed to remove facility';
      throw new Error(errorMessage);
    }
  },

  // FIX: Added a test method to check API response format
  testApiResponse: async () => {
    try {
      const response = await api.get('/institutes/public');
      console.log('🧪 TEST - Raw API Response:', response);
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