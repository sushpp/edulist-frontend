import api from "../api/api";

export const instituteService = {
  getAllInstitutes: async (filters = {}) => {
    try {
      const response = await api.get("/institutes", { params: filters });
      const institutes = response.data?.institutes;
      return { institutes: Array.isArray(institutes) ? institutes : [] };
    } catch (err) {
      console.error("Error fetching all institutes:", err);
      return { institutes: [] };
    }
  },

  getInstituteById: async (id) => {
    try {
      const response = await api.get(`/institutes/${id}`);
      return response.data?.institute || {};
    } catch (err) {
      console.error("Error fetching institute by ID:", err);
      return {};
    }
  },

  getFeaturedInstitutes: async () => {
    try {
      const response = await api.get("/institutes/featured");
      const featured = response.data?.institutes;
      // Normalize: always return an array
      return Array.isArray(featured)
        ? featured
        : featured
        ? [featured]
        : [];
    } catch (err) {
      console.error("Error fetching featured institutes:", err);
      return [];
    }
  },

  getInstituteProfile: async () => {
    try {
      const response = await api.get("/institutes/profile");
      return response.data?.institute || {};
    } catch (err) {
      console.error("Error fetching institute profile:", err);
      return {};
    }
  },

  updateInstitute: async (data) => {
    try {
      const response = await api.put("/institutes/profile", data);
      return response.data?.institute || {};
    } catch (err) {
      console.error("Error updating institute profile:", err);
      return {};
    }
  },

  getPendingInstitutes: async () => {
    try {
      const response = await api.get("/institutes/admin/pending");
      const pending = response.data?.institutes;
      return Array.isArray(pending) ? pending : [];
    } catch (err) {
      console.error("Error fetching pending institutes:", err);
      return [];
    }
  },

  updateInstituteStatus: async (instituteId, status) => {
    try {
      const response = await api.put(`/institutes/admin/${instituteId}/status`, { status });
      return response.data || {};
    } catch (err) {
      console.error("Error updating institute status:", err);
      return {};
    }
  }
};
