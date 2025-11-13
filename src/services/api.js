// src/services/api.js
import axios from 'axios';

// Base API URL Configuration
const isLocalhost = window.location.hostname === 'localhost';
const API_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace(/\/$/, '')
  : isLocalhost
  ? 'http://localhost:5000/api'
  : 'https://edulist-backend-clv5.onrender.com/api';

// Create and Configure Axios Instance
// Timeout is set to 60 seconds to prevent any timeout errors.
const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60 seconds
});

// Request Interceptor: Add Auth Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Errors & Fix URLs
api.interceptors.response.use(
  (response) => {
    // Fix for Mixed Content Warnings
    const responseStr = JSON.stringify(response.data);
    if (responseStr.includes('http://edulist-backend-clv5.onrender.com')) {
      const fixedStr = responseStr.replace(/http:\/\/edulist-backend-clv5\.onrender\.com/g, 'https://edulist-backend-clv5.onrender.com');
      response.data = JSON.parse(fixedStr);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('API Error: No response from server', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API Module Exports
export const authAPI = {
  login: (email, password, role) => api.post('/auth/login', { email, password, role }),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export const instituteAPI = {
  getAll: (filters = {}) => api.get('/institutes', { params: filters }),
  getById: (id) => api.get(`/institutes/${id}`),
  getPending: () => api.get('/institutes/admin/pending'),
  updateStatus: (id, status) => api.put(`/institutes/admin/${id}/status`, { status }),
  getMyInstitute: () => api.get('/institutes/profile'),
  update: (data) => api.put('/institutes/profile', data),
};

export const courseAPI = {
  create: (data) => api.post('/courses', data),
  getByInstitute: (instituteId) => api.get(`/courses/institute/${instituteId}`),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  getMyCourses: () => api.get('/courses/my'),
};

export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByInstitute: (instituteId) => api.get(`/reviews/institute/${instituteId}`),
  getMyReviews: () => api.get('/reviews/my-reviews'),
  getAll: () => api.get('/reviews'),
  updateStatus: (id, status) => api.put(`/reviews/admin/${id}/status`, { status }),
};

export const enquiryAPI = {
  create: (data) => api.post('/enquiries', data),
  getMyEnquiries: () => api.get('/enquiries/my-enquiries'),
  getByInstitute: (instituteId) => api.get(`/enquiries/institute/${instituteId}`),
  getAll: () => api.get('/enquiries'),
  updateStatus: (id, status) => api.put(`/enquiries/${id}`, { status }),
};

export const userAPI = {
  getAll: () => api.get('/users'),
  updateStatus: (id, isActive) => api.put(`/users/${id}/status`, { isActive }),
};

export const facilitiesAPI = {
  create: (data) => api.post('/facilities', data),
  getByInstitute: (instituteId) => api.get(`/facilities/institute/${instituteId}`),
  getMyFacilities: () => api.get('/facilities/my/facilities'),
  update: (id, data) => api.put(`/facilities/${id}`, data),
  delete: (id) => api.delete(`/facilities/${id}`),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getUserStats: (userId) => api.get(`/analytics/user/${userId}`),
};

export const uploadAPI = {
  uploadImage: (formData) =>
    api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;