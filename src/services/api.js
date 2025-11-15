// src/api/api.js
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_API_BASE_URL; // Dynamic API URL

if (!BACKEND_URL) {
  console.error('🚨 REACT_APP_API_BASE_URL is not defined. Check your .env file.');
}

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 60000,
});

// Attach token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🔗 Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto logout on 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
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

export default api;
