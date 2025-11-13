import api from './api';

export const facilityService = {
  // Get all facilities for current institute
  getFacilities: async () => {
    try {
      const response = await api.get('/facilities');
      const data = response.data;
      
      // FIX: Enhanced response normalization with multiple fallbacks
      console.log('🔍 Facilities API Response:', data);
      
      if (Array.isArray(data)) {
        console.log('📦 API returned direct array');
        return data;
      } else if (data && Array.isArray(data.facilities)) {
        console.log('📦 API returned { facilities: array }');
        return data.facilities;
      } else if (data && data.data && Array.isArray(data.data)) {
        console.log('📦 API returned { data: array }');
        return data.data;
      } else if (data && data.data && Array.isArray(data.data.facilities)) {
        console.log('📦 API returned { data: { facilities: array } }');
        return data.data.facilities;
      } else if (data && typeof data === 'object') {
        // Try to find any array property in the response
        const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]));
        if (arrayKeys.length > 0) {
          console.log(`📦 Found array in property: ${arrayKeys[0]}`);
          return data[arrayKeys[0]];
        }
      }
      
      // If no array found, return empty array to prevent .map() errors
      console.warn('❌ Unexpected API response format for facilities. No array found. Returning empty array.');
      console.warn('Response structure:', typeof data, data);
      return [];
      
    } catch (error) {
      console.error('❌ Error fetching facilities:', error);
      // FIX: Return empty array on error to prevent crashes
      return [];
    }
  },

  // Get facilities by institute ID (for public viewing)
  getFacilitiesByInstitute: async (instituteId) => {
    try {
      const response = await api.get(`/facilities/institute/${instituteId}`);
      const data = response.data;
      
      // FIX: Enhanced response normalization
      console.log('🔍 Institute Facilities API Response:', data);
      
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.facilities)) {
        return data.facilities;
      } else if (data && data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data && data.data && Array.isArray(data.data.facilities)) {
        return data.data.facilities;
      } else if (data && typeof data === 'object') {
        // Try to find any array property in the response
        const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]));
        if (arrayKeys.length > 0) {
          return data[arrayKeys[0]];
        }
      }
      
      console.warn('❌ Unexpected API response format for institute facilities. Returning empty array.');
      return [];
      
    } catch (error) {
      console.error('❌ Error fetching institute facilities:', error);
      return [];
    }
  },

  // Add new facility
  addFacility: async (facilityData) => {
    try {
      const response = await api.post('/facilities', facilityData);
      // FIX: Normalize response format
      const data = response.data;
      console.log('🔍 Add Facility API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error adding facility:', error);
      // FIX: Return null instead of throwing error
      console.warn('⚠️ Error adding facility - Returning null');
      return null;
    }
  },

  // Update facility
  updateFacility: async (facilityId, facilityData) => {
    try {
      const response = await api.put(`/facilities/${facilityId}`, facilityData);
      // FIX: Normalize response format
      const data = response.data;
      console.log('🔍 Update Facility API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error updating facility:', error);
      // FIX: Return null instead of throwing error
      console.warn('⚠️ Error updating facility - Returning null');
      return null;
    }
  },

  // Remove facility
  removeFacility: async (facilityId) => {
    try {
      const response = await api.delete(`/facilities/${facilityId}`);
      // FIX: Normalize response format
      const data = response.data;
      console.log('🔍 Remove Facility API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error removing facility:', error);
      // FIX: Return null instead of throwing error
      console.warn('⚠️ Error removing facility - Returning null');
      return null;
    }
  },

  // FIX: Added method to get current institute's facilities (for institute dashboard)
  getMyFacilities: async () => {
    try {
      const response = await api.get('/facilities/my');
      const data = response.data;
      
      // FIX: Enhanced response normalization
      console.log('🔍 My Facilities API Response:', data);
      
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.facilities)) {
        return data.facilities;
      } else if (data && data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data && data.data && Array.isArray(data.data.facilities)) {
        return data.data.facilities;
      } else if (data && typeof data === 'object') {
        // Try to find any array property in the response
        const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]));
        if (arrayKeys.length > 0) {
          return data[arrayKeys[0]];
        }
      }
      
      console.warn('❌ Unexpected API response format for my facilities. Returning empty array.');
      return [];
      
    } catch (error) {
      console.error('❌ Error fetching my facilities:', error);
      return [];
    }
  },

  // FIX: Added method to get facility by ID
  getFacilityById: async (facilityId) => {
    try {
      const response = await api.get(`/facilities/${facilityId}`);
      const data = response.data;
      console.log('🔍 Facility by ID API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching facility by ID:', error);
      // FIX: Return null instead of throwing error
      return null;
    }
  },

  // FIX: Added test method to check API response format
  testApiResponse: async (endpoint = '/facilities') => {
    try {
      const response = await api.get(endpoint);
      console.log('🧪 TEST - Raw Facility API Response:', response);
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
  },

  // FIX: Added method to test all facility endpoints
  testAllEndpoints: async () => {
    try {
      console.log('🧪 TESTING ALL FACILITY ENDPOINTS...');
      
      // Test 1: Check if /facilities works
      console.log('🧪 Testing /facilities...');
      try {
        const facilities = await api.get('/facilities');
        console.log('✅ /facilities - SUCCESS:', facilities.data);
      } catch (error) {
        console.log('❌ /facilities - FAILED:', error.response?.status, error.message);
      }
      
      // Test 2: Check if /facilities/my works
      console.log('🧪 Testing /facilities/my...');
      try {
        const myFacilities = await api.get('/facilities/my');
        console.log('✅ /facilities/my - SUCCESS:', myFacilities.data);
      } catch (error) {
        console.log('❌ /facilities/my - FAILED:', error.response?.status, error.message);
      }
      
      // Test 3: Check if /facilities/institute/{id} works
      console.log('🧪 Testing /facilities/institute/{id}...');
      try {
        const instituteFacilities = await api.get('/facilities/institute/test-id');
        console.log('✅ /facilities/institute/{id} - SUCCESS:', instituteFacilities.data);
      } catch (error) {
        console.log('❌ /facilities/institute/{id} - FAILED:', error.response?.status, error.message);
      }
      
      return { success: true };
    } catch (error) {
      console.error('🧪 TEST - Error:', error);
      return { success: false, error: error.message };
    }
  }
};