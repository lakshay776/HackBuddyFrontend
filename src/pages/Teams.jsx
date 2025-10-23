import React, { useState, useEffect } from 'react';
import { Plus, Users, Trophy, Calendar, UserPlus, Settings, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { teamsAPI } from '../api/teams';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeam, setNewTeam] = useState({
    teamName: '',
    Goal: ''
  });
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamsAPI.getMyTeams();
      console.log('Teams response:', response);
      setTeams(response || []);
    } catch (error) {
      setError('Failed to fetch teams');
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeam.teamName.trim() || !newTeam.Goal.trim()) return;

    setCreating(true);
    try {
      await teamsAPI.createTeam(newTeam);
      setNewTeam({ teamName: '', Goal: '' });
      setShowCreateForm(false);
      await fetchTeams();
      alert('Team created successfully!');
    } catch (error) {
      alert('Failed to create team. Please try again.');
      console.error('Create team error:', error);
    } finally {
      setCreating(false);
    }
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchTeams}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Teams</h1>
            <p className="text-gray-600">Manage your teams and register for hackathons</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Team</span>
          </Button>
        </div>

        {/* Create Team Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Team</h3>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={newTeam.teamName}
                    onChange={(e) => setNewTeam(prev => ({ ...prev, teamName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter team name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Goal
                  </label>
                  <textarea
                    value={newTeam.Goal}
                    onChange={(e) => setNewTeam(prev => ({ ...prev, Goal: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Describe your team's goals"
                    rows="3"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    loading={creating}
                    disabled={creating}
                    className="flex-1"
                  >
                    Create Team
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {teams.length === 0 ? (
          <Card className="p-8 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Teams Yet</h3>
            <p className="text-gray-600 mb-4">Create your first team to get started!</p>
            <Button onClick={() => setShowCreateForm(true)}>
              Create Team
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Card key={team._id} hover className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {team.teamName}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {team.Goal}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{team.members.length} members</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Created: {formatDate(team.createdAt)}</span>
                  </div>
                </div>

                {/* Team Members */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Members</h4>
                  <div className="space-y-1">
                    {team.members.map((member, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {member.users?.Name || `Member ${index + 1}`}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>


                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Invite
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/teams/${team._id}`)}
                  >
                    Manage Team
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
