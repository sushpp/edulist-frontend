import api from './api';

export const enquiryService = {
  createEnquiry: async (enquiryData) => {
    const response = await api.post('/enquiries', enquiryData);
    return response.data;
  },

  getInstituteEnquiries: async () => {
    const response = await api.get('/enquiries/institute');
    return response.data;
  },

  getUserEnquiries: async () => {
    const response = await api.get('/enquiries/user');
    return response.data;
  },

  updateEnquiryStatus: async (enquiryId, status) => {
    const response = await api.put(`/enquiries/${enquiryId}/status`, { status });
    return response.data;
  },

  respondToEnquiry: async (enquiryId, response) => {
    const res = await api.put(`/enquiries/${enquiryId}/respond`, { response });
    return res.data;
  }
};