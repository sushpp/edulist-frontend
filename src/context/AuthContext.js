// context/AuthContext.js

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import api from '../services/api';

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'), // Get token from storage on load
  loading: true,
};

// Create context
const AuthContext = createContext();

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload, // Spreads token, user, isAuthenticated, etc.
        isAuthenticated: true,
        loading: false,
      };
    case 'AUTH_ERROR':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token header
  const setAuthToken = (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  // Load user from server
  // We wrap this in useCallback to prevent it from being recreated on every render,
  // which would cause the useEffect below to run in an infinite loop.
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (token) {
      setAuthToken(token);
    } else {
      dispatch({ type: 'AUTH_ERROR' });
      return;
    }

    try {
      // --- FIX: Call the correct endpoint ---
      const res = await api.get('/auth/me');
      dispatch({
        type: 'USER_LOADED',
        payload: res.data.data, // The getMe response has { success: true, data: user }
      });
    } catch (err) {
      console.error('Failed to load user:', err.response?.data);
      dispatch({
        type: 'AUTH_ERROR',
      });
    }
  }, []); // Empty dependency array because we read from localStorage directly

  // Register user
  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data, // res.data is { success: true, token: ..., user: ... }
      });
      
      return res.data;
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response?.data,
      });
      
      throw err.response?.data;
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await api.post('/auth/login', formData);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data, // res.data is { success: true, token: ..., user: ... }
      });
      
      return res.data;
    } catch (err) {
      console.error('Login error:', err.response?.data);
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response?.data,
      });
      
      throw err.response?.data;
    }
  };

  // Logout
  const logout = () => {
    dispatch({
      type: 'LOGOUT',
    });
  };

  // This effect runs only once when the provider mounts.
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Update token header whenever state.token changes
  useEffect(() => {
    setAuthToken(state.token);
  }, [state.token]);


  const value = {
    ...state,
    register,
    login,
    logout,
    loadUser,
    setAuthToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;