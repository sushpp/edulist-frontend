import api from './api';

/**
 * @typedef {Object} Institute
 * @property {string} _id - The unique identifier for the institute.
 * @property {string} name - The name of the institute.
 * @property {string} [category] - The category of the institute (e.g., 'school', 'college').
 * @property {string} [affiliation] - The affiliation board (e.g., 'CBSE', 'University').
 * @property {Object} [address] - The address object.
 * @property {string} [address.city] - The city of the institute.
 * @property {string} [address.state] - The state of the institute.
 * @property {Array<Object>} [reviews] - An array of review objects.
 * @property {string} [description] - A short description of the institute.
 */

/**
 * A service layer for handling all institute-related API calls.
 * It normalizes responses and handles errors gracefully.
 */
export const instituteService = {
  /**
   * Fetches all public institutes with optional filters.
   * Normalizes the API response to ensure a consistent { institutes: Array } structure.
   * @param {Object} [filters={}] - The query parameters for filtering institutes.
   * @returns {Promise<{institutes: Institute[]}>} A promise that resolves to an object containing an array of institutes.
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
      
      const response = await api.get(`/institutes/public?${params}`);
      const data = response.data;
      
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

  /**
   * Fetches a single institute by its ID.
   * @param {string} id - The ID of the institute to fetch.
   * @returns {Promise<Institute>} A promise that resolves to the institute object.
   * @throws {Error} If the institute is not found or the request fails.
   */
  getInstituteById: async (id) => {
    try {
      const response = await api.get(`/institutes/${id}`);
      const institute = response.data;

      // Basic validation to ensure we got an institute object
      if (!institute || !institute._id) {
        throw new Error('Invalid institute data received from server.');
      }
      
      return institute;
    } catch (error) {
      console.error(`Error fetching institute with id ${id}:`, error);
      
      if (error.response?.status === 404) {
        throw new Error('Institute not found');
      }
      
      // Re-throw the validation error or a generic one
      if (error.message.includes('Invalid institute data')) {
        throw error;
      }
      
      const errorMessage = error.response?.data?.message || 'Failed to fetch institute details';
      throw new Error(errorMessage);
    }
  },

  /**
   * Fetches the profile of the currently logged-in institute.
   * @returns {Promise<Institute>} A promise that resolves to the institute's profile data.
   * @throws {Error} If the user is not authenticated or the request fails.
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
   * @param {Partial<Institute>} data - The data to update.
   * @returns {Promise<Institute>} A promise that resolves to the updated institute profile.
   * @throws {Error} If the update fails.
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
   * @throws {Error} If adding the facility fails.
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
   * @throws {Error} If removing the facility fails.
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