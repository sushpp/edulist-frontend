import api from './api';

export const adminService = {
  getDashboardAnalytics: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      const data = response?.data || {};

      // Provide defaults for analytics metrics
      return {
        analytics: {
          totalUsers: data.analytics?.totalUsers || 0,
          totalInstitutes: data.analytics?.totalInstitutes || 0,
          pendingInstitutes: data.analytics?.pendingInstitutes || 0,
          totalReviews: data.analytics?.totalReviews || 0,
          totalEnquiries: data.analytics?.totalEnquiries || 0,
          totalCourses: data.analytics?.totalCourses || 0,
        },
        recentActivities: data.recentActivities || [],
      };
    } catch (err) {
      console.error("Error fetching dashboard analytics:", err);
      return {
        analytics: {
          totalUsers: 0,
          totalInstitutes: 0,
          pendingInstitutes: 0,
          totalReviews: 0,
          totalEnquiries: 0,
          totalCourses: 0,
        },
        recentActivities: [],
      };
    }
  },

  getPendingInstitutes: async () => {
    try {
      const response = await api.get('/admin/institutes/pending');
      return response?.data?.institutes || [];
    } catch (err) {
      console.error("Error fetching pending institutes:", err);
      return [];
    }
  },

  verifyInstitute: async (instituteId) => {
    try {
      const response = await api.put(`/admin/institutes/${instituteId}/verify`);
      return response?.data;
    } catch (err) {
      console.error(`Error verifying institute with ID ${instituteId}:`, err);
      return { error: true };
    }
  },

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
