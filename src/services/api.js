// src/services/api.js
import axios from 'axios';

// Create a single, robust Axios instance that reads from your .env file
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout for requests
});

// Request interceptor to add the authentication token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors globally
api.interceptors.response.use(
  (response) => {
    // For successful responses (HTTP status 2xx)
    return response;
  },
  (error) => {
    // If the server responds with a 401 (Unauthorized), it means the token is bad
    if (error.response?.status === 401) {
      console.warn('Unauthorized! Logging out...');
      localStorage.removeItem('token');
      // Redirect to the login page, but avoid an infinite redirect loop
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;