import React, { useState, useEffect } from 'react';
import { Calendar, Users, ExternalLink, Trophy, Clock, Plus, X } from 'lucide-react';
import { hackathonsAPI } from '../api/hackathons';
import { teamsAPI } from '../api/teams';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const Hackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newHackathon, setNewHackathon] = useState({
    HackathonName: '',
    EventDate: '',
    TeamSize: '',
    Description: '',
    LastRegistrationDate: ''
  });

  const { user } = useAuth();

  useEffect(() => {
    fetchHackathons();
    fetchMyTeams();
  }, []);

  const fetchHackathons = async () => {
    try {
      const response = await hackathonsAPI.getAllHackathons();
      setHackathons(response || []);
    } catch (error) {
      setError('Failed to fetch hackathons');
      console.error('Error fetching hackathons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyTeams = async () => {
    try {
      const response = await teamsAPI.getMyTeams();
      // Filter teams to only show those where user is the leader
      const leaderTeams = response.filter(team => team.teamLeader?._id === user?._id);
      setMyTeams(leaderTeams || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const openHackathonDetails = (hackathon) => {
    setSelectedHackathon(hackathon);
    setShowDetailsModal(true);
  };

  const handleRegisterTeam = async (hackathonId, teamId) => {
    setRegistering(prev => ({ ...prev, [`${hackathonId}-${teamId}`]: true }));

    try {
      await teamsAPI.registerTeamForHackathon({
        hackathonId,
        teamId
      });

      // Refresh hackathons to show updated registration
      await fetchHackathons();

      alert('Team registered successfully!');
    } catch (error) {
      alert('Failed to register team. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setRegistering(prev => ({ ...prev, [`${hackathonId}-${teamId}`]: false }));
    }
  };

  const handleCreateHackathon = async (e) => {
    e.preventDefault();

    if (!newHackathon.HackathonName || !newHackathon.EventDate || !newHackathon.TeamSize || !newHackathon.Description || !newHackathon.LastRegistrationDate) {
      alert('Please fill in all fields');
      return;
    }

    setCreating(true);
    try {
      await hackathonsAPI.createHackathon(newHackathon);
      setNewHackathon({
        HackathonName: '',
        EventDate: '',
        TeamSize: '',
        Description: '',
        LastRegistrationDate: ''
      });
      setShowCreateForm(false);
      await fetchHackathons();
      alert('Hackathon created successfully!');
    } catch (error) {
      alert('Failed to create hackathon. Please try again.');
      console.error('Create hackathon error:', error);
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

  const isRegistrationOpen = (lastRegistrationDate) => {
    return new Date(lastRegistrationDate) > new Date();
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
          <Button onClick={fetchHackathons}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Hackathons</h1>
              <p className="text-gray-600">Discover and participate in exciting hackathons</p>
            </div>
            {user?.role === 'Admin' && (
              <Button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Hackathon</span>
              </Button>
            )}
          </div>
        </div>

        {hackathons.length === 0 ? (
          <Card className="p-8 text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Hackathons Available</h3>
            <p className="text-gray-600">Check back later for upcoming hackathons!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((hackathon) => (
              <Card key={hackathon._id} hover className="p-6">
                {/* Simplified View */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {hackathon.HackathonName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Organized by {hackathon.organizer}
                    </p>
                  </div>
                  {hackathon.ExternalLink && (
                    <a
                      href={hackathon.ExternalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 ml-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>

                {/* More Details Button */}
                <div className="mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openHackathonDetails(hackathon)}
                    className="w-full"
                  >
                    More Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create Hackathon Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Hackathon</h3>
              <form onSubmit={handleCreateHackathon} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hackathon Name
                  </label>
                  <input
                    type="text"
                    value={newHackathon.HackathonName}
                    onChange={(e) => setNewHackathon(prev => ({ ...prev, HackathonName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter hackathon name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date
                  </label>
                  <input
                    type="datetime-local"
                    value={newHackathon.EventDate}
                    onChange={(e) => setNewHackathon(prev => ({ ...prev, EventDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={newHackathon.LastRegistrationDate}
                    onChange={(e) => setNewHackathon(prev => ({ ...prev, LastRegistrationDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newHackathon.TeamSize}
                    onChange={(e) => setNewHackathon(prev => ({ ...prev, TeamSize: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 4"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newHackathon.Description}
                    onChange={(e) => setNewHackathon(prev => ({ ...prev, Description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Describe the hackathon"
                    rows="3"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    className="flex-1"
                    loading={creating}
                    disabled={creating}
                  >
                    Create Hackathon
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

        {/* Hackathon Details Modal */}
        {showDetailsModal && selectedHackathon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedHackathon.HackathonName}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailsModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{selectedHackathon.Description}</p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-3" />
                      <div>
                        <p className="font-medium">Event Date</p>
                        <p>{formatDate(selectedHackathon.EventDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-3" />
                      <div>
                        <p className="font-medium">Registration Deadline</p>
                        <p>{formatDate(selectedHackathon.LastRegistrationDate)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-5 h-5 mr-3" />
                      <div>
                        <p className="font-medium">Team Size</p>
                        <p>{selectedHackathon.TeamSize} members</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Trophy className="w-5 h-5 mr-3" />
                      <div>
                        <p className="font-medium">Organizer</p>
                        <p>{selectedHackathon.organizer}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Section */}
                {isRegistrationOpen(selectedHackathon.LastRegistrationDate) ? (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Register Your Team</h3>
                    {myTeams.length > 0 ? (
                      <div className="space-y-3">
                        {myTeams.map((team) => (
                          <div key={team._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{team.teamName}</p>
                              <p className="text-sm text-gray-600">{team.Goal}</p>
                            </div>
                            <Button
                              size="sm"
                              loading={registering[`${selectedHackathon._id}-${team._id}`]}
                              onClick={() => handleRegisterTeam(selectedHackathon._id, team._id)}
                              disabled={registering[`${selectedHackathon._id}-${team._id}`]}
                            >
                              Register
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">No teams available to lead</p>
                        <Button variant="outline" onClick={() => {
                          setShowDetailsModal(false);
                          window.location.href = '/teams';
                        }}>
                          Create Team
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-t pt-6">
                    <div className="text-center py-8">
                      <p className="text-red-600 font-medium">Registration Closed</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Registration ended on {formatDate(selectedHackathon.LastRegistrationDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hackathons;
