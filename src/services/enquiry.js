import api from './api';

export const enquiryService = {
  createEnquiry: async (enquiryData) => {
    try {
      const response = await api.post('/enquiries', enquiryData);
      // FIX: Normalize response format
      const data = response.data;
      console.log('🔍 Create Enquiry API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error in enquiryService.createEnquiry:', error);
      throw error;
    }
  },

  getInstituteEnquiries: async () => {
    try {
      const response = await api.get('/enquiries/institute');
      const data = response.data;
      
      // FIX: Enhanced response normalization with multiple fallbacks
      console.log('🔍 Institute Enquiries API Response:', data);
      
      if (Array.isArray(data)) {
        console.log('📦 API returned direct array');
        return data;
      } else if (data && Array.isArray(data.enquiries)) {
        console.log('📦 API returned { enquiries: array }');
        return data.enquiries;
      } else if (data && data.data && Array.isArray(data.data)) {
        console.log('📦 API returned { data: array }');
        return data.data;
      } else if (data && data.data && Array.isArray(data.data.enquiries)) {
        console.log('📦 API returned { data: { enquiries: array } }');
        return data.data.enquiries;
      } else if (data && typeof data === 'object') {
        // Try to find any array property in the response
        const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]));
        if (arrayKeys.length > 0) {
          console.log(`📦 Found array in property: ${arrayKeys[0]}`);
          return data[arrayKeys[0]];
        }
      }
      
      // If no array found, return empty array to prevent .map() errors
      console.warn('❌ Unexpected API response format for institute enquiries. No array found. Returning empty array.');
      console.warn('Response structure:', typeof data, data);
      return [];
      
    } catch (error) {
      console.error('❌ Error in enquiryService.getInstituteEnquiries:', error);
      // FIX: Return empty array on error to prevent crashes
      return [];
    }
  },

  getUserEnquiries: async () => {
    try {
      const response = await api.get('/enquiries/user');
      const data = response.data;
      
      // FIX: Enhanced response normalization with multiple fallbacks
      console.log('🔍 User Enquiries API Response:', data);
      
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.enquiries)) {
        return data.enquiries;
      } else if (data && data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data && data.data && Array.isArray(data.data.enquiries)) {
        return data.data.enquiries;
      } else if (data && typeof data === 'object') {
        // Try to find any array property in the response
        const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]));
        if (arrayKeys.length > 0) {
          return data[arrayKeys[0]];
        }
      }
      
      console.warn('❌ Unexpected API response format for user enquiries. Returning empty array.');
      return [];
      
    } catch (error) {
      console.error('❌ Error in enquiryService.getUserEnquiries:', error);
      // FIX: Return empty array on error to prevent crashes
      return [];
    }
  },

  updateEnquiryStatus: async (enquiryId, status) => {
    try {
      const response = await api.put(`/enquiries/${enquiryId}/status`, { status });
      // FIX: Normalize response format
      const data = response.data;
      console.log('🔍 Update Enquiry Status API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error in enquiryService.updateEnquiryStatus:', error);
      throw error;
    }
  },

  respondToEnquiry: async (enquiryId, responseText) => {
    try {
      // FIX: Renamed parameter to avoid conflict with response variable
      const res = await api.put(`/enquiries/${enquiryId}/respond`, { response: responseText });
      // FIX: Normalize response format
      const data = res.data;
      console.log('🔍 Respond to Enquiry API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error in enquiryService.respondToEnquiry:', error);
      throw error;
    }
  },

  // FIX: Added method to get all enquiries (for admin)
  getAllEnquiries: async () => {
    try {
      const response = await api.get('/enquiries');
      const data = response.data;
      
      // FIX: Enhanced response normalization
      console.log('🔍 All Enquiries API Response:', data);
      
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.enquiries)) {
        return data.enquiries;
      } else if (data && data.data && Array.isArray(data.data)) {
        return data.data;
      } else {
        console.warn('❌ Unexpected API response format for all enquiries. Returning empty array.');
        return [];
      }
      
    } catch (error) {
      console.error('❌ Error in enquiryService.getAllEnquiries:', error);
      return [];
    }
  },

  // FIX: Added test method to check API response format
  testApiResponse: async (endpoint = '/enquiries/institute') => {
    try {
      const response = await api.get(endpoint);
      console.log('🧪 TEST - Raw Enquiry API Response:', response);
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