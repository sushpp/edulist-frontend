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
      
      console.log('🔍 Institute API Response:', data);
      
      // FIX: Always return { institutes: array } for consistency
      let institutesArray = [];
      
      if (Array.isArray(data)) {
        console.log('📦 API returned direct array');
        institutesArray = data;
      } else if (data && Array.isArray(data.institutes)) {
        console.log('📦 API returned { institutes: array }');
        institutesArray = data.institutes;
      } else if (data && data.data && Array.isArray(data.data)) {
        console.log('📦 API returned { data: array }');
        institutesArray = data.data;
      } else if (data && data.data && Array.isArray(data.data.institutes)) {
        console.log('📦 API returned { data: { institutes: array } }');
        institutesArray = data.data.institutes;
      } else if (data && typeof data === 'object') {
        // Try to find any array property in the response
        const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]));
        if (arrayKeys.length > 0) {
          console.log(`📦 Found array in property: ${arrayKeys[0]}`);
          institutesArray = data[arrayKeys[0]];
        }
      }
      
      // FIX: Return consistent format { institutes: array }
      return { institutes: institutesArray };
      
    } catch (error) {
      console.error('❌ Error fetching institutes:', error);
      console.warn('⚠️ API Error - Returning empty institutes array');
      // FIX: Return consistent format even on error
      return { institutes: [] };
    }
  },

  getInstituteById: async (id) => {
    try {
      const response = await api.get(`/institutes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching institute:', error);
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
      console.warn('⚠️ Error removing facility - Returning null');
      return null;
    }
  },

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
      console.warn('⚠️ TEST - API Error - Returning empty object');
      return {};
    }
  }
};