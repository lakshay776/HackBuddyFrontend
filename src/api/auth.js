import api from './config.js';

export const authAPI = {
  // Login user
  login: async (email, password) => {
    const response = await api.post('/Login', { email, password });
    return response.data;
  },

  // Register user
  signup: async (userData) => {
    const response = await api.post('/SignUp', userData);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.get('/logout');
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/fetchAllUsers');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.patch('/editProfile', profileData);
    return response.data;
  },

  // Get notifications
  getNotifications: async () => {
    const response = await api.get('/getNotifications');
    return response.data;
  },

  // Like a user
  likeUser: async (userId) => {
    const response = await api.post('/likeUser', { userId });
    return response.data;
  }
};
