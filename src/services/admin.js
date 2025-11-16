import api from './api';

export const adminService = {
  // Fetch dashboard analytics with defaults
  getDashboardAnalytics: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      
      // --- CRITICAL DEBUGGING STEP ---
      // Log the ENTIRE response object from your API helper.
      // This will show you the status, headers, and data body.
      console.log('Raw API Response from /admin/dashboard:', response);

      // Ensure `data` is at least an object if response.data is null/undefined
      const data = response?.data || {};

      // --- STRUCTURE VALIDATION ---
      // Add a warning if the expected 'analytics' object is missing.
      // This helps you distinguish a network error (caught below) from a data structure error.
      if (!data || typeof data !== 'object' || !data.analytics) {
        console.warn("⚠️ API response is missing the expected 'analytics' property. Check your backend endpoint. Received data:", data);
      }

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
      // This block catches network errors (e.g., 404 Not Found, 500 Server Error)
      // or errors thrown by your `api` helper.
      console.error("❌ Network or API call error fetching dashboard analytics:", err);
      
      // Return a safe, default structure so the frontend doesn't crash.
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