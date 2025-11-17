// src/services/institute.js
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

export const instituteService = {
  getAllInstitutes: async (filters = {}) => {
    try {
      const response = await api.get("/institutes", { params: filters });
      if (!response || !response.data) return { institutes: [] };
      
      // Use safeGetArray to find the institutes array in multiple possible locations
      const institutes = safeGetArray(response.data, ['institutes', 'data', '']);
      return { institutes };
    } catch (err) {
      console.error("Error fetching all institutes:", err);
      return { institutes: [] };
    }
  },

  getInstituteById: async (id) => {
    try {
      const response = await api.get(`/institutes/${id}`);
      return response.data?.institute || response.data || {};
    } catch (err) {
      console.error("Error fetching institute by ID:", err);
      return {};
    }
  },

  getFeaturedInstitutes: async () => {
    try {
      const response = await api.get("/institutes/featured");
      if (!response || !response.data) return [];
      
      // Use safeGetArray to find the featured institutes array
      return safeGetArray(response.data, ['institutes', 'data', '']);
    } catch (err) {
      console.error("Error fetching featured institutes:", err);
      return [];
    }
  },

  getInstituteProfile: async () => {
    try {
      const response = await api.get("/institutes/profile");
      return response.data?.institute || response.data || {};
    } catch (err) {
      console.error("Error fetching institute profile:", err);
      return {};
    }
  },

  updateInstitute: async (data) => {
    try {
      const response = await api.put("/institutes/profile", data);
      return response.data?.institute || response.data || {};
    } catch (err) {
      console.error("Error updating institute profile:", err);
      return {};
    }
  },

  getPendingInstitutes: async () => {
    try {
      const response = await api.get("/institutes/admin/pending");
      if (!response || !response.data) return [];
      
      // Use safeGetArray to find the pending institutes array
      return safeGetArray(response.data, ['institutes', 'data', '']);
    } catch (err) {
      console.error("Error fetching pending institutes:", err);
      return [];
    }
  },

  updateInstituteStatus: async (instituteId, status) => {
    try {
      const response = await api.put(`/institutes/admin/${instituteId}/status`, { status });
      return response.data || { success: false };
    } catch (err) {
      console.error("Error updating institute status:", err);
      return { success: false };
    }
  },
};