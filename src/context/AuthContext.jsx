import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, user: action.payload.user, isAuthenticated: true, loading: false, error: null };
    case 'AUTH_FAILURE':
      return { ...state, user: null, isAuthenticated: false, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false, error: null };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }

        // Parse stored user data
        const userData = JSON.parse(storedUser);

        // Try to verify token by making a simple API call
        // If it fails, the interceptor will handle it
        const response = await authAPI.getProfile();
        if (response && Array.isArray(response)) {
          // Find the current user in the response
          const currentUser = response.find(user => user.email === userData.email);
          if (currentUser) {
            dispatch({ type: 'AUTH_SUCCESS', payload: { user: currentUser } });
          } else {
            // User not found in response, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else {
          dispatch({ type: 'AUTH_SUCCESS', payload: { user: userData } });
        }
      } catch (error) {
        console.log('Auth check failed:', error);
        // Clear invalid token - the interceptor should have already handled this
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.login(email, password);
      if (response.success) {
        // Store token and user data in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        dispatch({ type: 'AUTH_SUCCESS', payload: { user: response.user } });
        return { success: true };
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message || 'Login failed' });
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.signup(userData);
      if (response.success) {
        // Store token and user data in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        dispatch({ type: 'AUTH_SUCCESS', payload: { user: response.user } });

        // Check if user has a role set, if not, they need to select a role
        if (!response.user.role || response.user.role === 'Student') {
          // Redirect to role selection page for new users
          window.location.href = '/role-selection';
          return { success: true, needsRoleSelection: true };
        }

        return { success: true };
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message || 'Signup failed' });
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout(); // backend clears cookie
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const value = { ...state, login, signup, logout, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
