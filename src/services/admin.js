import api from './api';

export const adminService = {
  /**
   * Fetch dashboard analytics including all key metrics and recent activities.
   */
  getDashboardAnalytics: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      const data = response?.data || {};

      return {
        // Analytics metrics with defaults
        analytics: {
          totalUsers: Number(data.analytics?.totalUsers) || 0,
          totalInstitutes: Number(data.analytics?.totalInstitutes) || 0,
          pendingInstitutes: Number(data.analytics?.pendingInstitutes) || 0,
          totalReviews: Number(data.analytics?.totalReviews) || 0,
          totalEnquiries: Number(data.analytics?.totalEnquiries) || 0,
          totalCourses: Number(data.analytics?.totalCourses) || 0,
        },

        // Recent activities with safe defaults
        recentActivities: {
          newUsers: Array.isArray(data.recentActivities?.newUsers)
            ? data.recentActivities.newUsers
            : [],
          pendingInstitutes: Array.isArray(data.recentActivities?.pendingInstitutes)
            ? data.recentActivities.pendingInstitutes
            : [],
          recentReviews: Array.isArray(data.recentActivities?.recentReviews)
            ? data.recentActivities.recentReviews
            : [],
        },

        // Featured institutes safe fallback
        featuredInstitutes: Array.isArray(data.featuredInstitutes)
          ? data.featuredInstitutes
          : [],
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
        recentActivities: {
          newUsers: [],
          pendingInstitutes: [],
          recentReviews: [],
        },
        featuredInstitutes: [],
      };
    }
  },

  /**
   * Fetch all pending institutes awaiting approval.
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
   * Fetch all registered users.
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
