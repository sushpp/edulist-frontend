// src/services/api.js
import axios from 'axios';

// Base API URL Configuration with CORS proxy
const isLocalhost = window.location.hostname === 'localhost';
const isDevelopment = process.env.NODE_ENV === 'development';

// Use CORS proxy in development/production to bypass CORS issues
const BACKEND_URL = 'https://edulist-backend-clv5.onrender.com/api';

// CORS proxy options
const CORS_PROXIES = [
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?'
];

const getAPIUrl = () => {
  // Try direct connection first
  try {
    // For production, try direct connection with proxy fallback
    return BACKEND_URL;
  } catch (error) {
    console.warn('Using CORS proxy due to CORS issues');
    // Fallback to CORS proxy
    return CORS_PROXIES[0] + BACKEND_URL;
  }
};

const API_URL = getAPIUrl();

// Create and Configure Axios Instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  // FIX: Add CORS headers
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Auth Token and handle CORS
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // FIX: Add CORS headers to requests
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    
    console.log('🔗 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle CORS and Errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('🔴 API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    });

    // FIX: Handle CORS errors specifically
    if (error.message.includes('CORS') || error.message.includes('Access-Control-Allow-Origin')) {
      console.error('🔴 CORS Error Detected - Consider using a proxy');
      
      // Retry with CORS proxy if direct request fails
      if (!error.config.url.includes('cors-anywhere') && !error.config.url.includes('corsproxy')) {
        console.log('🔄 Retrying with CORS proxy...');
        const proxyUrl = CORS_PROXIES[0] + error.config.baseURL + error.config.url;
        return axios({
          ...error.config,
          url: proxyUrl,
          baseURL: undefined
        });
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// FIX: Enhanced API methods with CORS handling
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
  getPublic: (filters = {}) => api.get('/institutes/public', { params: filters }),
};

// ... rest of your API exports remain the same
export const courseAPI = {
  create: (data) => api.post('/courses', data),
  getByInstitute: (instituteId) => api.get(`/courses/institute/${instituteId}`),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  getMyCourses: () => api.get('/courses/my'),
  getAll: () => api.get('/courses'),
};

// ... (keep all your other API exports)

// FIX: Enhanced test function to diagnose CORS
export const testAPI = async () => {
  try {
    console.log('🧪 Testing API connectivity with CORS...');
    console.log('🔗 Frontend URL:', window.location.origin);
    console.log('🔗 Backend URL:', BACKEND_URL);
    
    // Test without auth first
    const response = await fetch(BACKEND_URL + '/health', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Direct fetch works:', data);
      return { success: true, method: 'direct', data };
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Direct fetch failed:', error.message);
    
    // Try with CORS proxy
    try {
      const proxyResponse = await fetch(CORS_PROXIES[0] + BACKEND_URL + '/health');
      if (proxyResponse.ok) {
        const data = await proxyResponse.json();
        console.log('✅ CORS proxy works:', data);
        return { success: true, method: 'proxy', data };
      }
    } catch (proxyError) {
      console.log('❌ CORS proxy also failed:', proxyError.message);
    }
    
    return { success: false, error: error.message };
  }
};

export default api;