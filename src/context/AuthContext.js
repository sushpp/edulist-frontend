// src/context/AuthContext.js

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import api from '../services/api';

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
};

const AuthContext = createContext();

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
      // action.payload expected to contain { token, user }
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
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

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setAuthTokenHeader = (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: 'AUTH_ERROR' });
      return;
    }

    setAuthTokenHeader(token);

    try {
      const res = await api.get('/auth/me');
      dispatch({ type: 'USER_LOADED', payload: res.data.data });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  }, []);

  // Register user
  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);

      // If backend returned token (auto-approved user), res.data will contain token + user
      if (res.data.token && res.data.user) {
        dispatch({
          type: 'REGISTER_SUCCESS',
          payload: { token: res.data.token, user: res.data.user }
        });

        // set header for future requests
        setAuthTokenHeader(res.data.token);

        // load user (or we already have user in payload)
        return { success: true, token: res.data.token, user: res.data.user };
      }

      // Otherwise, registration succeeded but account is pending (institute)
      return { success: true, pending: true, message: res.data.message };
    } catch (err) {
      const payload = err.response?.data || { message: 'Registration failed' };
      dispatch({ type: 'AUTH_ERROR', payload });
      throw payload;
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await api.post('/auth/login', formData);

      if (res.data.token && res.data.user) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { token: res.data.token, user: res.data.user }
        });

        setAuthTokenHeader(res.data.token);

        return { success: true, token: res.data.token, user: res.data.user };
      }

      // Should not reach here normally
      throw { message: 'Invalid login response from server' };
    } catch (err) {
      const payload = err.response?.data || { message: 'Login failed' };
      dispatch({ type: 'AUTH_ERROR', payload });
      throw payload;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  useEffect(() => {
    // Try to load user when provider mounts if token exists
    if (state.token) {
      loadUser();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [loadUser, state.token]);

  useEffect(() => {
    setAuthTokenHeader(state.token);
  }, [state.token]);

  const value = {
    ...state,
    register,
    login,
    logout,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
