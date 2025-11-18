// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage on initial render
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If there's a token, try to load the user
      api.get('/auth/me')
        .then(res => {
          setUser(res.data.data); // The user object is in res.data.data
          setIsAuthenticated(true);
        })
        .catch(err => {
          console.error("Failed to load user with token:", err);
          // If token is invalid, clear it
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []); // Empty dependency array means this runs only once on mount

  // Login function
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      
      const { token, user } = res.data; // Backend sends both token and user

      // Store token and user in state and localStorage
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error.response?.data);
      // Re-throw the error to be caught by the login form
      throw error.response?.data || { message: 'An unknown error occurred' };
    }
  };

  // Register function
  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      
      const { token, user } = res.data; // Backend sends both token and user

      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error.response?.data);
      // Re-throw the error to be caught by the registration form
      throw error.response?.data || { message: 'An unknown error occurred' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/'); // Redirect to home page after logout
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;