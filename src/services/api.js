import axios from 'axios';

// =======================
// ✅ Base API URL
// Auto-select between localhost and Render backend
// =======================
const isLocalhost = window.location.hostname === 'localhost';

const API_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace(/\/$/, '') // from .env if present
  : isLocalhost
  ? 'http://localhost:5000/api' // ✅ local backend
  : 'https://edulist-backend-clv5.onrender.com/api'; // ✅ Render backend (production)

// =======================
// ✅ Create axios instance
// =======================
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// =======================
// ✅ Request interceptor (add token)
// =======================
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

// =======================
// ✅ Response interceptor (handle errors)
// =======================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Unauthorized: clear auth and redirect
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

// =======================
// ✅ API MODULES
// =======================

// Auth API
export const authAPI = {
  login: (email, password, role) => api.post('/auth/login', { email, password, role }),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Institutes API
export const instituteAPI = {
  getAll: (filters = {}) => api.get('/institutes', { params: filters }),
  getById: (id) => api.get(`/institutes/${id}`),
  getPending: () => api.get('/institutes/admin/pending'),
  updateStatus: (id, status) => api.put(`/institutes/admin/${id}/status`, { status }),
  update: (id, data) => api.put(`/institutes/${id}`, data),
  getMyInstitute: () => api.get('/institutes/my/institute'),
};

// Courses API
export const courseAPI = {
  create: (data) => api.post('/courses', data),
  getByInstitute: (instituteId) => api.get(`/courses/institute/${instituteId}`),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  getMyCourses: () => api.get('/courses/my/courses'),
};

// Reviews API
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByInstitute: (instituteId) => api.get(`/reviews/institute/${instituteId}`),
  getMyReviews: () => api.get('/reviews/my-reviews'),
  getAll: () => api.get('/reviews'),
  updateStatus: (id, status) => api.put(`/reviews/admin/${id}/status`, { status }),
};

// Enquiries API
export const enquiryAPI = {
  create: (data) => api.post('/enquiries', data),
  getMyEnquiries: () => api.get('/enquiries/my-enquiries'),
  getByInstitute: (instituteId) => api.get(`/enquiries/institute/${instituteId}`),
  getAll: () => api.get('/enquiries'),
  updateStatus: (id, status) => api.put(`/enquiries/${id}`, { status }),
};

// Users API
export const userAPI = {
  getAll: () => api.get('/users'),
  updateStatus: (id, isActive) => api.put(`/users/${id}/status`, { isActive }),
};

// Facilities API
export const facilitiesAPI = {
  create: (data) => api.post('/facilities', data),
  getByInstitute: (instituteId) => api.get(`/facilities/institute/${instituteId}`),
  getMyFacilities: () => api.get('/facilities/my/facilities'),
  update: (id, data) => api.put(`/facilities/${id}`, data),
  delete: (id) => api.delete(`/facilities/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getUserStats: (userId) => api.get(`/analytics/user/${userId}`),
};

// File Upload API
export const uploadAPI = {
  uploadImage: (formData) =>
    api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Health Check API
export const healthAPI = {
  check: () => api.get('/health'),
};

// ✅ Export axios instance
export default api;
