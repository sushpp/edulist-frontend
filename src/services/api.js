// src/services/api.js
import axios from 'axios';

// -------------------------------
// 1️⃣ Backend & CORS Configuration
// -------------------------------
const BACKEND_URL = 'https://edulist-backend-clv5.onrender.com/api';

// NOTE: The CORS proxy logic has been removed. It's a major source of instability.
// The correct solution is to configure CORS on your backend server to allow requests
// from your frontend's domain.
const CORS_PROXIES = [
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?'
];

// -------------------------------
// 2️⃣ Axios Instance
// -------------------------------
const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 120000, // 60 seconds -> INCREASED TO 120 SECONDS
  headers: {
    'Content-Type': 'application/json',
  },
});

// -------------------------------
// 3️⃣ Request Interceptor: For Authentication
// -------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // This header can help some backends distinguish between AJAX requests and others.
    config.headers['X-Requested-With'] = 'XMLHttpRequest';

    console.log('🔗 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    // This is for request setup errors (e.g., invalid URL)
    console.error('🔴 Request Setup Error:', error);
    return Promise.reject(error);
  }
);

// -------------------------------
// 4️⃣ Response Interceptor: For Error Handling
// -------------------------------
api.interceptors.response.use(
  (response) => {
    // For successful responses (HTTP status 2xx)
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log detailed error information for easier debugging
    console.error('🔴 API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data, // Log the error response body from the server
      message: error.message
    });

    // --- 401 Unauthorized Handling ---
    // If the server explicitly says the token is invalid/expired.
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn('🔒 401 Unauthorized: Token is invalid or expired. Logging out.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Avoid redirect loops if already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Always reject the promise so the .catch() in your service files runs.
    return Promise.reject(error);
  }
);

// -------------------------------
// 5️⃣ API Methods
// -------------------------------

// --- Auth API ---
export const authAPI = {
  login: (email, password, role) => {
    const payload = role ? { email, password, role } : { email, password };
    return api.post('/auth/login', payload);
  },
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// --- Institute API ---
export const instituteAPI = {
  getAll: (filters = {}) => api.get('/institutes', { params: filters }),
  getById: (id) => api.get(`/institutes/${id}`),
  getPending: () => api.get('/admin/institutes/pending'),
  updateStatus: (id, status) => api.put(`/admin/institutes/${id}/status`, { status }),
  getMyInstitute: () => api.get('/institutes/profile'),
  update: (data) => api.put('/institutes/profile', data),
  getPublic: (filters = {}) => api.get('/institutes/public', { params: filters }),
};

// --- Course API ---
export const courseAPI = {
  create: (data) => api.post('/courses', data),
  getByInstitute: (instituteId) => api.get(`/courses/institute/${instituteId}`),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  getMyCourses: () => api.get('/courses/my'),
  getAll: () => api.get('/courses'),
};


// -------------------------------
// 6️⃣ Test API Connectivity (Utility)
// -------------------------------
export const testAPI = async () => {
  try {
    console.log('🧪 Testing API connectivity...');
    const response = await api.get('/health'); // Use the axios instance for consistency
    if (response.data) {
      console.log('✅ API is reachable:', response.data);
      return { success: true, data: response.data };
    }
  } catch (error) {
    console.log('❌ API is unreachable:', error.message);
    return { success: false, error: 'API unreachable' };
  }
};

export default api;