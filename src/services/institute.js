import api from "./api";

export const instituteService = {
  // Fetch all institutes
  getAllInstitutes: async (filters = {}) => {
    try {
      const response = await api.get("/institutes", { params: filters });
      const data = response.data;

      // Support both {institutes: [...]} and [...list] formats
      if (Array.isArray(data?.institutes)) return { institutes: data.institutes };
      if (Array.isArray(data)) return { institutes: data };
      return { institutes: [] };
    } catch (error) {
      console.error("❌ Error fetching institutes:", error);
      return { institutes: [] };
    }
  },

  // Get institute by ID
  getInstituteById: async (id) => {
    try {
      const response = await api.get(`/institutes/${id}`);
      return response.data || null;
    } catch (error) {
      console.error("❌ Error fetching institute by ID:", error);
      return null;
    }
  },

  // Get logged-in institute profile
  getInstituteProfile: async () => {
    try {
      const response = await api.get("/institutes/profile");
      return response.data || null;
    } catch (error) {
      console.error("❌ Error fetching institute profile:", error);
      return null;
    }
  },

  // Update institute profile
  updateInstitute: async (data) => {
    try {
      const response = await api.put("/institutes/profile", data);
      return response.data || null;
    } catch (error) {
      console.error("❌ Error updating institute:", error);
      return null;
    }
  },

  // Admin: pending institutes
  getPendingInstitutes: async () => {
    try {
      const response = await api.get("/institutes/admin/pending");
      const data = response.data;

      return Array.isArray(data?.institutes) ? data.institutes : [];
    } catch (error) {
      console.error("❌ Error fetching pending institutes:", error);
      return [];
    }
  },

  // Admin: update institute status
  updateInstituteStatus: async (instituteId, status) => {
    try {
      const response = await api.put(`/institutes/admin/${instituteId}/status`, { status });
      return response.data || null;
    } catch (error) {
      console.error("❌ Error updating institute status:", error);
      return null;
    }
  },
};
