import api from './api';

export const adminService = {
  // Fetch dashboard analytics with defaults
  getDashboardAnalytics: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      const data = response?.data || {};

      return {
        analytics: {
          totalUsers: data?.analytics?.totalUsers ?? 0,
          totalInstitutes: data?.analytics?.totalInstitutes ?? 0,
          pendingInstitutes: data?.analytics?.pendingInstitutes ?? 0,
          totalReviews: data?.analytics?.totalReviews ?? 0,
          totalEnquiries: data?.analytics?.totalEnquiries ?? 0,
          totalCourses: data?.analytics?.totalCourses ?? 0,
        },
        featuredInstitutes: Array.isArray(data?.featuredInstitutes)
          ? data.featuredInstitutes
          : [],
        recentActivities: {
          newUsers: Array.isArray(data?.recentActivities?.newUsers)
            ? data.recentActivities.newUsers
            : [],
          pendingInstitutes: Array.isArray(data?.recentActivities?.pendingInstitutes)
            ? data.recentActivities.pendingInstitutes
            : [],
          recentReviews: Array.isArray(data?.recentActivities?.recentReviews)
            ? data.recentActivities.recentReviews
            : [],
        },
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
        featuredInstitutes: [],
        recentActivities: {
          newUsers: [],
          pendingInstitutes: [],
          recentReviews: [],
        },
      };
    }
  },

  // Fetch pending institutes safely
  getPendingInstitutes: async () => {
    try {
      const response = await api.get('/admin/institutes/pending');
      return Array.isArray(response?.data?.institutes)
        ? response.data.institutes
        : [];
    } catch (err) {
      console.error("Error fetching pending institutes:", err);
      return [];
    }
  },

  // Verify institute
  verifyInstitute: async (instituteId) => {
    try {
      const response = await api.put(`/admin/institutes/${instituteId}/verify`);
      return response?.data || { success: false };
    } catch (err) {
      console.error(`Error verifying institute with ID ${instituteId}:`, err);
      return { success: false };
    }
  },

  // Fetch all users safely
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return Array.isArray(response?.data?.users)
        ? response.data.users
        : [];
    } catch (err) {
      console.error("Error fetching users list:", err);
      return [];
    }
  },

  // Toggle user status safely
  toggleUserStatus: async (userId, isActive) => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, { isActive });
      return response?.data || { success: false };
    } catch (err) {
      console.error(`Error toggling status for user ${userId}:`, err);
      return { success: false };
    }
  },

  // Update institute status safely
  updateInstituteStatus: async (instituteId, status) => {
    try {
      const response = await api.put(`/admin/institutes/${instituteId}/status`, { status });
      return response?.data || { success: false };
    } catch (err) {
      console.error(`Error updating status for institute ${instituteId}:`, err);
      return { success: false };
    }
  },
};
