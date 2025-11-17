import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import api from '../services/api';

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
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
        token: action.payload.token,
        isAuthenticated: true,
        user: action.payload.user,
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

  // Load user
  // We wrap this in useCallback to prevent it from being recreated on every render,
  // which would cause the useEffect below to run in an infinite loop.
  const loadUser = useCallback(async () => {
    // IMPORTANT: Read token directly from localStorage here to avoid stale closure issues.
    // If we relied on `state.token`, it might be from the initial render and be `undefined`.
    const token = localStorage.getItem('token');

    if (token) {
      setAuthToken(token);
    } else {
      dispatch({ type: 'AUTH_ERROR' });
      return;
    }

    try {
      const res = await api.get('/auth');
      dispatch({
        type: 'USER_LOADED',
        payload: res.data,
      });
    } catch (err) {
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
        payload: res.data,
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'AUTH_ERROR',
      });
      
      throw err.response.data;
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await api.post('/auth/login', formData);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data,
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'AUTH_ERROR',
      });
      
      throw err.response.data;
    }
  };

  // Logout
  const logout = () => {
    dispatch({
      type: 'LOGOUT',
    });
  };

  // This effect runs only once when the component mounts.
  // It will call the stable `loadUser` function.
  useEffect(() => {
    loadUser();
  }, [loadUser]);

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

// Export the context itself for any rare cases it might be needed directly
export { AuthContext };

export default AuthContext;