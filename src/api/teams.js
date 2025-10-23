import api from './config';

export const teamsAPI = {
  // Create a new team
  createTeam: async (teamData) => {
    const response = await api.post('/createTeam', teamData);
    return response.data;
  },

  // Get user's teams
  getMyTeams: async () => {
    const response = await api.get('/getMyTeams');
    return response.data;
  },

  // Send team invite
  sendInvite: async (inviteData) => {
    const response = await api.post('/sendInvite', inviteData);
    return response.data;
  },

  // Respond to team invite
  respondInvite: async (responseData) => {
    const response = await api.post('/respondInvite', responseData);
    return response.data;
  },

  // Register team for hackathon
  registerTeamForHackathon: async (registrationData) => {
    const response = await api.post('/registerTeamForHackathon', registrationData);
    return response.data;
  }
};
