import api from './api';

// Set auth token header
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Register user
export const register = async (formData) => {
  try {
    const res = await api.post('/auth/register', formData);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

// Login user
export const login = async (formData) => {
  try {
    const res = await api.post('/auth/login', formData);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const res = await api.get('/auth');
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};