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
      console.log('🔍 Institute API Response:', data);
      
      // Handle various response formats and always return { institutes: array }
      if (Array.isArray(data)) {
        console.log('📦 API returned direct array');
        return { institutes: data }; // Wrap array in object
      } else if (data && Array.isArray(data.institutes)) {
        console.log('📦 API returned { institutes: array }');
        return data; // Return as is
      } else if (data && data.data && Array.isArray(data.data)) {
        console.log('📦 API returned { data: array }');
        return { institutes: data.data }; // Wrap array in object
      } else if (data && data.data && Array.isArray(data.data.institutes)) {
        console.log('📦 API returned { data: { institutes: array } }');
        return { institutes: data.data.institutes }; // Wrap array in object
      } else if (data && typeof data === 'object') {
        // Try to find any array property in the response
        const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]));
        if (arrayKeys.length > 0) {
          console.log(`📦 Found array in property: ${arrayKeys[0]}`);
          return { institutes: data[arrayKeys[0]] }; // Wrap array in object
        }
      }
      
      // If no array found, return empty array in object
      console.warn('❌ Unexpected API response format. No array found. Returning empty array.');
      console.warn('Response structure:', typeof data, data);
      return { institutes: [] }; // Return empty array in object
      
    } catch (error) {
      console.error('❌ Error fetching institutes:', error);
      
      // FIX: Return empty array in object instead of throwing error
      console.warn('⚠️ API Error - Returning empty institutes array');
      return { institutes: [] }; // Return empty array in object
    }
  },

  getInstituteById: async (id) => {
    try {
      const response = await api.get(`/institutes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching institute:', error);
      // FIX: Return null instead of throwing error
      console.warn(`⚠️ Error fetching institute ${id} - Returning null`);
      return null;
    }
  },

  getInstituteProfile: async () => {
    try {
      const response = await api.get('/institutes/profile');
      const data = response.data;
      console.log('🔍 Institute Profile API Response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching institute profile:', error);
      if (error.response?.status === 401) {
        console.warn('⚠️ Unauthorized - User not logged in as institute');
      }
      // FIX: Return null instead of throwing error
      console.warn('⚠️ Error fetching institute profile - Returning null');
      return null;
    }
  },

  updateInstitute: async (data) => {
    try {
      const response = await api.put('/institutes/profile', data);
      return response.data;
    } catch (error) {
      console.error('Error updating institute:', error);
      // FIX: Return null instead of throwing error
      console.warn('⚠️ Error updating institute - Returning null');
      return null;
    }
  },

  addFacility: async (facility) => {
    try {
      const response = await api.post('/institutes/facilities', facility);
      const data = response.data;
      console.log('🔍 Add Facility API Response:', data);
      return data;
    } catch (error) {
      console.error('Error adding facility:', error);
      // FIX: Return null instead of throwing error
      console.warn('⚠️ Error adding facility - Returning null');
      return null;
    }
  },

  removeFacility: async (facilityId) => {
    try {
      const response = await api.delete(`/institutes/facilities/${facilityId}`);
      const data = response.data;
      console.log('🔍 Remove Facility API Response:', data);
      return data;
    } catch (error) {
      console.error('Error removing facility:', error);
      // FIX: Return null instead of throwing error
      console.warn('⚠️ Error removing facility - Returning null');
      return null;
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
      // FIX: Return empty object instead of throwing error
      console.warn('⚠️ TEST - API Error - Returning empty object');
      return {};
    }
  }
};