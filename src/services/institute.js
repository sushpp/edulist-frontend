// src/services/institute.js
import api from './api';

/**
 * A service layer for handling all institute-related API calls.
 * It normalizes responses and handles errors gracefully.
 */
export const instituteService = {
  /**
   * Fetches all public institutes with optional filters.
   * Normalizes the API response to ensure a consistent { institutes: Array } structure.
   * @param {Object} [filters={}] - The query parameters for filtering institutes.
   * @returns {Promise<{institutes: Array}>} A promise that resolves to an object containing an array of institutes.
   * @throws {Error} If the request fails or the server returns an error.
   */
  getAllInstitutes: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      
      const requestUrl = `/institutes/public?${params}`;
      
      // === DEBUGGING LOG 1: Shows the full URL being requested ===
      console.log(`Attempting to fetch from URL: ${api.defaults.baseURL}${requestUrl}`);
      
      const response = await api.get(requestUrl);
      const data = response.data;
      
      // === DEBUGGING LOG 2: Shows the raw data from the backend ===
      console.log('SUCCESS: Raw API Response:', data);
      
      // Normalize the response to ensure it always has the expected structure
      if (Array.isArray(data)) {
        // If the API returned a direct array, wrap it in an object
        console.log('API returned a direct array. Wrapping it.');
        return { institutes: data };
      } else if (data && Array.isArray(data.institutes)) {
        // If the API returned the expected object, use it as is
        console.log('API returned the expected object. Using it.');
        return data;
      } else if (data && data.data && Array.isArray(data.data)) {
        // Handle case where data is nested in a data property
        console.log('API returned nested data. Extracting it.');
        return { institutes: data.data };
      } else {
        // If the response is something else, return an empty array to prevent crashes
        console.warn('Unexpected API response format. Returning empty array:', data);
        return { institutes: [] };
      }
    } catch (error) {
      // === DEBUGGING LOG 3: Shows the error object ===
      console.error('CATCH: API call failed with error:', error);
      
      // Check if it's a network error (no response from server)
      if (!error.response) {
        // This covers 'ERR_NETWORK', 'ERR_INTERNET_DISCONNECTED', etc.
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      // Use the error message from the backend or a generic one
      const errorMessage = error.response?.data?.message || 'Failed to fetch institutes';
      throw new Error(errorMessage);
    }
  },

  /**
   * Fetches a single institute by its ID.
   * @param {string} id - The ID of the institute to fetch.
   * @returns {Promise<Object>} A promise that resolves to the institute object.
   */
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

  /**
   * Fetches the profile of the currently logged-in institute.
   * @returns {Promise<Object>} A promise that resolves to the institute's profile data.
   */
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

  /**
   * Updates the profile of the currently logged-in institute.
   * @param {Object} data - The data to update.
   * @returns {Promise<Object>} A promise that resolves to the updated profile.
   */
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

  /**
   * Adds a new facility to the institute's profile.
   * @param {Object} facility - The facility object to add.
   * @returns {Promise<Object>} A promise that resolves to the updated facilities list.
   */
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

  /**
   * Removes a facility from the institute's profile.
   * @param {string} facilityId - The ID of the facility to remove.
   * @returns {Promise<Object>} A promise that resolves to the updated facilities list.
   */
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