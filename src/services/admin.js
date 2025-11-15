import api from './api';

export const adminService = {
  getDashboardAnalytics: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data?.data || {}; // data consistency
  },

  getPendingInstitutes: async () => {
    const response = await api.get('/admin/institutes/pending');
    return response.data?.institutes || [];
  },

  verifyInstitute: async (instituteId) => {
    const response = await api.put(`/admin/institutes/${instituteId}/verify`);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data?.users || [];
  },
};
