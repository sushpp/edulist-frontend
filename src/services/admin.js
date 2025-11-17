import api from './api';

export const adminService = {
  // Fetch dashboard analytics with enhanced error handling
  getDashboardAnalytics: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      
      // If the entire response is missing or invalid
      if (!response || !response.data) {
        console.warn("API response for dashboard is missing or null. Returning default structure.");
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

      const data = response.data;

      return {
        analytics: {
          totalUsers: data?.analytics?.totalUsers ?? 0,
          totalInstitutes: data?.analytics?.totalInstitutes ?? 0,
          pendingInstitutes: data?.analytics?.pendingInstitutes ?? 0,
          totalReviews: data?.analytics?.totalReviews ?? 0,
          totalEnquiries: data?.analytics?.totalEnquiries ?? 0,
          totalCourses: data?.analytics?.totalCourses ?? 0,
        },
        // Ensure featuredInstitutes is always an array
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
      console.error("❌ Network or API call error fetching dashboard analytics:", err);
      
      // Return a safe, default structure
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

  // Fetch pending institutes with improved error handling
  getPendingInstitutes: async () => {
    try {
      const response = await api.get('/admin/institutes/pending');
      
      // Check multiple possible response structures
      if (Array.isArray(response?.data)) {
        return response.data;
      } else if (Array.isArray(response?.data?.institutes)) {
        return response.data.institutes;
      } else if (Array.isArray(response?.data?.data)) {
        return response.data.data;
      } else {
        console.warn("Unexpected response structure for getPendingInstitutes:", response);
        return [];
      }
    } catch (err) {
      console.error("Error fetching pending institutes:", err);
      return [];
    }
  },

  // Verify institute with improved error handling
  verifyInstitute: async (instituteId) => {
    try {
      const response = await api.put(`/admin/institutes/${instituteId}/verify`);
      return response?.data || { success: false };
    } catch (err) {
      console.error(`Error verifying institute with ID ${instituteId}:`, err);
      return { success: false };
    }
  },

  // Fetch all users with improved error handling
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      
      // Check multiple possible response structures
      if (Array.isArray(response?.data)) {
        return response.data;
      } else if (Array.isArray(response?.data?.users)) {
        return response.data.users;
      } else if (Array.isArray(response?.data?.data)) {
        return response.data.data;
      } else {
        console.warn("Unexpected response structure for getAllUsers:", response);
        return [];
      }
    } catch (err) {
      console.error("Error fetching users list:", err);
      return [];
    }
  },

  // Toggle user status with improved error handling
  toggleUserStatus: async (userId, isActive) => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, { isActive });
      return response?.data || { success: false };
    } catch (err) {
      console.error(`Error toggling status for user ${userId}:`, err);
      return { success: false };
    }
  },

  // Update institute status with improved error handling
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