import api from './api';

export const adminService = {
  getDashboardAnalytics: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      // Return mock data for demo purposes
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
      return response.data;
    } catch (error) {
      console.error('Error fetching pending institutes:', error);
      // Return mock data for demo
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
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      // Return mock data for demo
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
      return response.data;
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