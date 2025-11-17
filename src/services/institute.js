import api from './api';

// Get all institutes
export const getInstitutes = async (params = {}) => {
  try {
    const res = await api.get('/institutes', { params });
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      message: err.response?.data?.message || 'Failed to fetch institutes' 
    };
  }
};

// Get institute by ID
export const getInstituteById = async (id) => {
  try {
    const res = await api.get(`/institutes/${id}`);
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      message: err.response?.data?.message || 'Failed to fetch institute' 
    };
  }
};

// Create institute
export const createInstitute = async (formData) => {
  try {
    const res = await api.post('/institutes', formData);
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      message: err.response?.data?.message || 'Failed to create institute' 
    };
  }
};

// Update institute
export const updateInstitute = async (id, formData) => {
  try {
    const res = await api.put(`/institutes/${id}`, formData);
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      message: err.response?.data?.message || 'Failed to update institute' 
    };
  }
};

// Get institute reviews
export const getInstituteReviews = async (id) => {
  try {
    const res = await api.get(`/institutes/${id}/reviews`);
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      message: err.response?.data?.message || 'Failed to fetch reviews' 
    };
  }
};

// Get institute enquiries
export const getInstituteEnquiries = async (id) => {
  try {
    const res = await api.get(`/institutes/${id}/enquiries`);
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      message: err.response?.data?.message || 'Failed to fetch enquiries' 
    };
  }
};