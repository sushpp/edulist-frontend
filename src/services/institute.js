// src/services/institute.js - UPDATED
import api from './api';

export const instituteService = {
  // ✅ Get all institutes (public) - uses /institutes or /institutes/public
  getAllInstitutes: async (filters = {}) => {
    try {
      const response = await api.get('/institutes', { params: filters });
      const data = response.data;
      
      console.log('🔍 Institute API Response:', data);
      
      // Normalize response - backend returns { institutes: array }
      if (data && Array.isArray(data.institutes)) {
        return { institutes: data.institutes };
      } else if (Array.isArray(data)) {
        return { institutes: data };
      } else {
        console.warn('Unexpected API response format. Returning empty array.');
        return { institutes: [] };
      }
    } catch (error) {
      console.error('❌ Error fetching institutes:', error);
      return { institutes: [] };
    }
  },

  // ✅ Get institute by ID
  getInstituteById: async (id) => {
    try {
      const response = await api.get(`/institutes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching institute:', error);
      return null;
    }
  },

  // ✅ Get institute profile (logged-in institute)
  getInstituteProfile: async () => {
    try {
      const response = await api.get('/institutes/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching institute profile:', error);
      return null;
    }
  },

  // ✅ Update institute profile
  updateInstitute: async (data) => {
    try {
      const response = await api.put('/institutes/profile', data);
      return response.data;
    } catch (error) {
      console.error('Error updating institute:', error);
      return null;
    }
  },

  // ✅ Get pending institutes (admin)
  getPendingInstitutes: async () => {
    try {
      const response = await api.get('/institutes/admin/pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending institutes:', error);
      return { institutes: [] };
    }
  },

  // ✅ Update institute status (admin)
  updateInstituteStatus: async (instituteId, status) => {
    try {
      const response = await api.put(`/institutes/admin/${instituteId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating institute status:', error);
      return null;
    }
  }
};