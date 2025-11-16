import api from './api';

export const adminService = {
  getDashboardAnalytics: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response?.data || {
        analytics: {
          totalUsers: 0,
          totalInstitutes: 0,
          pendingInstitutes: 0,
          totalReviews: 0,
          totalEnquiries: 0,
          totalCourses: 0,
        },
        recentActivities: {
          newUsers: [],
          pendingInstitutes: [],
          recentReviews: [],
        },
      };
    } catch (err) {
      console.error('Error fetching dashboard analytics:', err);
      return {
        analytics: {
          totalUsers: 0,
          totalInstitutes: 0,
          pendingInstitutes: 0,
          totalReviews: 0,
          totalEnquiries: 0,
          totalCourses: 0,
        },
        recentActivities: {
          newUsers: [],
          pendingInstitutes: [],
          recentReviews: [],
        },
      };
    }
  },

  getPendingInstitutes: async () => {
    try {
      const response = await api.get('/admin/institutes/pending');
      return Array.isArray(response?.data?.institutes) ? response.data.institutes : [];
    } catch (err) {
      console.error('Error fetching pending institutes:', err);
      return [];
    }
  },

  updateInstituteStatus: async (instituteId, status) => {
    try {
      const response = await api.put(`/admin/institutes/${instituteId}/status`, { status });
      return response?.data || {};
    } catch (err) {
      console.error(`Error updating institute status for ${instituteId}:`, err);
      return {};
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return Array.isArray(response?.data?.users) ? response.data.users : [];
    } catch (err) {
      console.error('Error fetching users:', err);
      return [];
    }
  },

  toggleUserStatus: async (userId, isActive) => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, { isActive });
      return response?.data || {};
    } catch (err) {
      console.error(`Error toggling user status for ${userId}:`, err);
      return {};
    }
  },
};
