// src/services/api.js
import axios from 'axios';

// -------------------------------
// 1️⃣ Backend & CORS Configuration
// -------------------------------
const BACKEND_URL = 'https://edulist-backend-clv5.onrender.com/api';

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
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// -------------------------------
// 3️⃣ Request Interceptor
// -------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-Requested-With'] = 'XMLHttpRequest';

    console.log('🔗 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------------------
// 4️⃣ Response Interceptor
// -------------------------------
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error('🔴 API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    });

    // Retry with CORS proxy if CORS error detected
    if (
      (error.message.includes('CORS') || error.message.includes('Access-Control-Allow-Origin')) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const proxyUrl =
        CORS_PROXIES[0] +
        (originalRequest.url.startsWith('http')
          ? originalRequest.url
          : BACKEND_URL + originalRequest.url);

      console.log('🔄 Retrying with CORS proxy:', proxyUrl);
      return axios({
        ...originalRequest,
        url: proxyUrl,
        baseURL: undefined,
      });
    }

    // Handle 401 Unauthorized
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
  getPending: () => api.get('/institutes/admin/pending'),
  updateStatus: (id, status) => api.put(`/institutes/admin/${id}/status`, { status }),
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
// 6️⃣ Test API Connectivity
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
