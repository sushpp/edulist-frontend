import api from './api';

// Helper function to safely extract and ensure an array
const safeGetArray = (data, possiblePaths) => {
  if (!data || typeof data !== 'object') {
    console.warn('Data is not an object, cannot extract array:', data);
    return [];
  }

  for (const path of possiblePaths) {
    const value = path.split('.').reduce((obj, key) => obj && obj[key], data);
    
    if (Array.isArray(value)) {
      return value;
    }
    
    // Handle case where API returns a stringified array
    if (typeof value === 'string') {
      try {
        const parsedValue = JSON.parse(value);
        if (Array.isArray(parsedValue)) {
          console.warn(`API returned a stringified array at path ${path}. Parsed successfully.`);
          return parsedValue;
        }
      } catch (e) {
        console.warn(`API returned a string at path ${path}, but it's not valid JSON.`, value);
      }
    }
  }
  
  console.warn('Could not find an array in any of the expected paths:', possiblePaths, 'in data:', data);
  return [];
};

export const adminService = {
  // Fetch dashboard analytics with enhanced error handling
  getDashboardAnalytics: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      
      // CRITICAL DEBUG: Log the raw response from axios
      console.log('Raw axios response from /admin/dashboard:', response);
      
      if (!response || !response.data) {
        console.warn("API response for dashboard is missing or null. Returning default structure.");
        return {
          analytics: { totalUsers: 0, totalInstitutes: 0, pendingInstitutes: 0, totalReviews: 0, totalEnquiries: 0, totalCourses: 0 },
          featuredInstitutes: [],
          recentActivities: { newUsers: [], pendingInstitutes: [], recentReviews: [] },
        };
      }

      const data = response.data;
      
      // CRITICAL DEBUG: Log the data object before safeGetArray
      console.log('Data object being passed to safeGetArray:', data);
      
      const safeResponse = {
        analytics: { totalUsers: 0, totalInstitutes: 0, pendingInstitutes: 0, totalReviews: 0, totalEnquiries: 0, totalCourses: 0 },
        featuredInstitutes: safeGetArray(data, ['featuredInstitutes', 'data.featuredInstitutes', 'data']),
        recentActivities: {
          newUsers: safeGetArray(data, ['recentActivities.newUsers', 'data.recentActivities.newUsers']),
          pendingInstitutes: safeGetArray(data, ['recentActivities.pendingInstitutes', 'data.recentActivities.pendingInstitutes']),
          recentReviews: safeGetArray(data, ['recentActivities.recentReviews', 'data.recentActivities.recentReviews']),
        },
      };

      if (data && data.analytics && typeof data.analytics === 'object') {
        safeResponse.analytics = {
          totalUsers: data.analytics.totalUsers ?? 0,
          totalInstitutes: data.analytics.totalInstitutes ?? 0,
          pendingInstitutes: data.analytics.pendingInstitutes ?? 0,
          totalReviews: data.analytics.totalReviews ?? 0,
          totalEnquiries: data.analytics.totalEnquiries ?? 0,
          totalCourses: data.analytics.totalCourses ?? 0,
        };
      }

      // CRITICAL DEBUG: Log the final safeResponse object
      console.log('Final safeResponse being returned by adminService:', safeResponse);
      
      return safeResponse;
    } catch (err) {
      console.error("❌ Network or API call error fetching dashboard analytics:", err);
      
      // Return a safe, default structure
      return {
        analytics: { totalUsers: 0, totalInstitutes: 0, pendingInstitutes: 0, totalReviews: 0, totalEnquiries: 0, totalCourses: 0 },
        featuredInstitutes: [],
        recentActivities: { newUsers: [], pendingInstitutes: [], recentReviews: [] },
      };
    }
  },

  // Fetch pending institutes with improved error handling
  getPendingInstitutes: async () => {
    try {
      const response = await api.get('/admin/institutes/pending');
      if (!response || !response.data) return [];
      return safeGetArray(response.data, ['institutes', 'data', '']);
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
      if (!response || !response.data) return [];
      return safeGetArray(response.data, ['users', 'data', '']);
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