import api from './api';

export const facilityService = {
  // Get all facilities for current institute
  getFacilities: async () => {
    try {
      const response = await api.get('/facilities');
      return response.data;
    } catch (error) {
      console.error('Error fetching facilities:', error);
      throw error;
    }
  },

  // Add new facility
addFacility: async (facilityData) => {
    try {
      const response = await api.post('/facilities', facilityData);
      return response.data;
    } catch (error) {
      console.error('Error adding facility:', error);
      throw error;
    }
  },

  // Update facility
  updateFacility: async (facilityId, facilityData) => {
    try {
      const response = await api.put(`/facilities/${facilityId}`, facilityData);
      return response.data;
    } catch (error) {
      console.error('Error updating facility:', error);
      throw error;
    }
  },

  // Remove facility
  removeFacility: async (facilityId) => {
    try {
      const response = await api.delete(`/facilities/${facilityId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing facility:', error);
      throw error;
    }
  }
};