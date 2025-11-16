// src/services/api.js
import axios from 'axios';

// -------------------------------
// 1️⃣ Backend & CORS Configuration
// -------------------------------
const BACKEND_URL = 'https://edulist-backend-clv5.onrender.com/api';

// NOTE: Using a CORS proxy is a temporary workaround. The ideal solution
// is to configure CORS correctly on your backend server to allow requests
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
  timeout: 60000, // 60 seconds
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

    // --- CORS Retry Logic (Use with Caution) ---
    // This is a fallback. It retries a request through a proxy ONLY if a network-level
    // CORS error is detected. It will NOT retry if the server responds with an error message.
    if (
      error.message.includes('Network Error') || // More reliable for CORS issues
      error.message.includes('CORS') ||
      (error.response?.status === 0) // Another sign of CORS/network block
      && !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const proxyUrl = CORS_PROXIES[0] + BACKEND_URL + originalRequest.url;

      console.warn('🔄 CORS/Network error detected. Retrying with proxy:', proxyUrl);
      // Make a new, direct axios call without the instance's baseURL
      return axios({
        ...originalRequest,
        url: proxyUrl,
        baseURL: undefined, // Important: override baseURL
      });
    }

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

    // Always reject the promise so the .catch() in your service files (like adminService) runs.
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
  // FIX: Standardized admin endpoint path for consistency
  getPending: () => api.get('/admin/institutes/pending'),
  // FIX: Standardized admin endpoint path for consistency
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
    const response = await fetch(BACKEND_URL + '/health');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Direct fetch works:', data);
      return { success: true, method: 'direct', data };
    }
  } catch (error) {
    console.log('❌ Direct fetch failed:', error.message);
    try {
      const proxyResponse = await fetch(CORS_PROXIES[0] + BACKEND_URL + '/health');
      if (proxyResponse.ok) {
        const data = await proxyResponse.json();
        console.log('✅ CORS proxy works:', data);
        return { success: true, method: 'proxy', data };
      }
    } catch (proxyError) {
      console.log('❌ CORS proxy failed:', proxyError.message);
    }
  }
  return { success: false, error: 'API unreachable' };
};

export default api;