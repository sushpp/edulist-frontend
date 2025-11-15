// src/services/institute.js
import api from "../api/api";

export const instituteService = {
  getAllInstitutes: async (filters = {}) => {
    const response = await api.get("/institutes", { params: filters });
    return response.data?.institutes || [];
  },

  getInstituteById: async (id) => {
    const response = await api.get(`/institutes/${id}`);
    return response.data?.institute || null;
  },

  getInstituteProfile: async () => {
    const response = await api.get("/institutes/profile");
    return response.data?.institute || null;
  },

  updateInstitute: async (data) => {
    const response = await api.put("/institutes/profile", data);
    return response.data?.institute || null;
  },

  getPendingInstitutes: async () => {
    const response = await api.get("/institutes/admin/pending");
    return response.data?.institutes || [];
  },

  updateInstituteStatus: async (instituteId, status) => {
    const response = await api.put(`/institutes/admin/${instituteId}/status`, { status });
    return response.data;
  },
};
