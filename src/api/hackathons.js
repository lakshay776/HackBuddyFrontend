import api from './config';

export const hackathonsAPI = {
  // Get all hackathons
  getAllHackathons: async () => {
    const response = await api.get('/fetchAllHackathon');
    return response.data;
  },

  // Create hackathon (admin only)
  createHackathon: async (hackathonData) => {
    const response = await api.post('/createHackathon', hackathonData);
    return response.data;
  },

  // Delete hackathon (admin only)
  deleteHackathon: async (hackathonId) => {
    const response = await api.get(`/deleteHackathon?id=${hackathonId}`);
    return response.data;
  }
};
