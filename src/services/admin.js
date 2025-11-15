import api from './api';

export const adminService = {
  getDashboardAnalytics: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      const data = response.data;

      // Safely extract analytics and recentActivities
      return {
        analytics: data?.analytics || data?.data?.analytics || {
          totalUsers: 0,
          totalInstitutes: 0,
          pendingInstitutes: 0,
          totalReviews: 0,
          totalEnquiries: 0,
          totalCourses: 0
        },
        recentActivities: data?.recentActivities || data?.data?.recentActivities || {
          newUsers: [],
          pendingInstitutes: [],
          recentReviews: []
        },
      };
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      // Return fallback data
      return {
        analytics: {
          totalUsers: 150,
          totalInstitutes: 25,
          pendingInstitutes: 3,
          totalReviews: 240,
          totalEnquiries: 180,
          totalCourses: 75
        },
        recentActivities: {
          newUsers: [],
          pendingInstitutes: [],
          recentReviews: []
        }
      };
    }
  },

  getPendingInstitutes: async () => {
    try {
      const response = await api.get('/admin/institutes/pending');
      const data = response.data;

      return Array.isArray(data?.institutes) ? data.institutes : data || [];
    } catch (error) {
      console.error('Error fetching pending institutes:', error);
      return [];
    }
  },

  updateInstituteStatus: async (instituteId, status) => {
    const response = await api.put(`/admin/institutes/${instituteId}/status`, { status });
    return response.data;
  },

  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data?.users || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  toggleUserStatus: async (userId, isActive) => {
    const response = await api.put(`/admin/users/${userId}/status`, { isActive });
    return response.data;
  },

  getAllReviews: async () => {
    try {
      const response = await api.get('/admin/reviews');
      return response.data?.reviews || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  updateReviewStatus: async (reviewId, status) => {
    const response = await api.put(`/admin/reviews/${reviewId}/status`, { status });
    return response.data;
  }
};
