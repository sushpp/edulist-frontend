import api from './api';

export const adminService = {
  getDashboardAnalytics: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response?.data || {}; // Return entire object containing analytics + recentActivities
    } catch (err) {
      console.error("Error fetching dashboard analytics:", err);
      return {};
    }
  },

  /**
   * Get a list of all pending institutes awaiting approval.
   */
  getPendingInstitutes: async () => {
    try {
      const response = await api.get('/admin/institutes/pending');
      return response?.data?.institutes || [];
    } catch (err) {
      console.error("Error fetching pending institutes:", err);
      return [];
    }
  },

  /**
   * Verify an institute by its ID.
   */
  verifyInstitute: async (instituteId) => {
    try {
      const response = await api.put(`/admin/institutes/${instituteId}/verify`);
      return response?.data;
    } catch (err) {
      console.error(`Error verifying institute with ID ${instituteId}:`, err);
      return { error: true };
    }
  },

  /**
   * Get a list of all registered users.
   */
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response?.data?.users || [];
    } catch (err) {
      console.error("Error fetching users list:", err);
      return [];
    }
  },
};
