// src/services/institute.js
import api from "./api";

export const instituteService = {
  // -------------------------------------------------------
  // ✅ Get all institutes (public)
  // -------------------------------------------------------
  getAllInstitutes: async (filters = {}) => {
    try {
      const response = await api.get("/institutes", { params: filters });
      const data = response.data;

      console.log("🔍 Institute API Response:", data);

      // Normalized output always returns { institutes: [] }
      if (data && Array.isArray(data.institutes)) {
        return { institutes: data.institutes };
      }

      if (Array.isArray(data)) {
        return { institutes: data };
      }

      console.warn("⚠️ Unexpected API format for /institutes:", data);
      return { institutes: [] };
    } catch (error) {
      console.error("❌ Error fetching institutes:", error);
      return { institutes: [] };
    }
  },

  // -------------------------------------------------------
  // ✅ Get institute by ID
  // -------------------------------------------------------
  getInstituteById: async (id) => {
    try {
      const response = await api.get(`/institutes/${id}`);
      return response.data || null;
    } catch (error) {
      console.error("❌ Error fetching institute by ID:", error);
      return null;
    }
  },

  // -------------------------------------------------------
  // ✅ Get profile of the logged-in institute
  // -------------------------------------------------------
  getInstituteProfile: async () => {
    try {
      const response = await api.get("/institutes/profile");
      const data = response.data;

      if (!data) {
        console.warn("⚠️ No profile data returned");
        return null;
      }

      return data;
    } catch (error) {
      console.error("❌ Error fetching institute profile:", error);
      return null;
    }
  },

  // -------------------------------------------------------
  // ✅ Update institute profile
  // -------------------------------------------------------
  updateInstitute: async (data) => {
    try {
      const response = await api.put("/institutes/profile", data);
      return response.data || null;
    } catch (error) {
      console.error("❌ Error updating institute:", error);
      return null;
    }
  },

  // -------------------------------------------------------
  // ✅ Admin – Get pending institutes
  // -------------------------------------------------------
  getPendingInstitutes: async () => {
    try {
      const response = await api.get("/institutes/admin/pending");
      const data = response.data;

      if (data && Array.isArray(data.institutes)) {
        return { institutes: data.institutes };
      }

      console.warn("⚠️ Unexpected API format for admin/pending:", data);
      return { institutes: [] };
    } catch (error) {
      console.error("❌ Error fetching pending institutes:", error);
      return { institutes: [] };
    }
  },

  // -------------------------------------------------------
  // ✅ Admin – Update institute status
  // -------------------------------------------------------
  updateInstituteStatus: async (instituteId, status) => {
    try {
      const response = await api.put(
        `/institutes/admin/${instituteId}/status`,
        { status }
      );

      return response.data || null;
    } catch (error) {
      console.error("❌ Error updating institute status:", error);
      return null;
    }
  },
};
