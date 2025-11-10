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
      return response.data;
    } catch (error) {
      console.error('Error fetching institutes:', error);
      throw new Error('Failed to fetch institutes');
    }
  },

  getInstituteById: async (id) => {
    try {
      const response = await api.get(`/institutes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching institute:', error);
      throw new Error('Failed to fetch institute details');
    }
  },

  getInstituteProfile: async () => {
    try {
      const response = await api.get('/institutes/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching institute profile:', error);
      throw new Error('Failed to fetch institute profile');
    }
  },

  updateInstitute: async (data) => {
    try {
      const response = await api.put('/institutes/profile', data);
      return response.data;
    } catch (error) {
      console.error('Error updating institute:', error);
      throw new Error('Failed to update institute profile');
    }
  },

  addFacility: async (facility) => {
    try {
      const response = await api.post('/institutes/facilities', facility);
      return response.data;
    } catch (error) {
      console.error('Error adding facility:', error);
      throw new Error('Failed to add facility');
    }
  },

  removeFacility: async (facilityId) => {
    try {
      const response = await api.delete(`/institutes/facilities/${facilityId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing facility:', error);
      throw new Error('Failed to remove facility');
    }
  }
};