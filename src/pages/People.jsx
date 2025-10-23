import React, { useState, useEffect } from 'react';
import { User, Github, Linkedin, Mail, Phone, MapPin, Calendar, Star, ExternalLink, Briefcase, Award, X } from 'lucide-react';
import { authAPI } from '../api/auth';
import { teamsAPI } from '../api/teams';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const People = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingInvite, setSendingInvite] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
      fetchTeams();
    }
  }, [currentUser]);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.bio && user.bio.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    // Don't fetch if currentUser is not available yet
    if (!currentUser?._id) {
      return;
    }

    try {
      const response = await authAPI.getProfile();
      console.log('Users response:', response);

      // Filter out current user and invalid users
      const validUsers = Array.isArray(response)
        ? response.filter(user =>
            user &&
            user._id &&
            user.Name &&
            user.email &&
            user._id !== currentUser._id // Exclude current user
          )
        : [];

      console.log('Valid users (excluding self):', validUsers);
      setUsers(validUsers);
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await teamsAPI.getMyTeams();
      setTeams(response || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleSendInvite = (userId) => {
    console.log('Handle send invite called for user:', userId);
    console.log('Available teams:', teams);

    if (teams.length === 0) {
      alert('You need to create a team first before you can send invites.');
      return;
    }
    setSelectedUserId(userId);
    setShowTeamSelector(true);
  };

  const handleTeamSelection = async () => {
    console.log('Handle team selection called');
    console.log('Selected team ID:', selectedTeamId);
    console.log('Selected user ID:', selectedUserId);

    if (!selectedTeamId) {
      alert('Please select a team');
      return;
    }

    if (!selectedUserId) {
      alert('No user selected');
      return;
    }

    // Ensure IDs are strings
    const teamId = String(selectedTeamId);
    const userId = String(selectedUserId);

    setSendingInvite(prev => ({ ...prev, [userId]: true }));

    try {
      console.log('Sending invite with data:', {
        teamId: selectedTeamId,
        teamIdType: typeof selectedTeamId,
        userId: selectedUserId,
        userIdType: typeof selectedUserId
      });

      console.log('Converted IDs:', { teamId, userId });
      console.log('Team ID length:', teamId.length, 'User ID length:', userId.length);

      await teamsAPI.sendInvite({
        teamId,
        userId
      });

      alert('Invite sent successfully!');
      setShowTeamSelector(false);
      setSelectedUserId(null);
      setSelectedTeamId('');
    } catch (error) {
      alert('Failed to send invite. Please try again.');
      console.error('Invite error:', error);
    } finally {
      setSendingInvite(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleWhatsApp = (phoneNumber) => {
    const message = encodeURIComponent("Hi! I'd like to connect with you about potential collaboration opportunities.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const openUserProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
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
          <Button onClick={fetchUsers}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">People</h1>
          <p className="text-gray-600 mb-6">Connect with developers and build amazing teams</p>
          
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search by name, college, or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <Card className="p-8 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No users found' : 'No users available'}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'Check back later for more users!'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card key={user._id} hover className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {user.Name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{user.college}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Star className="w-4 h-4 mr-1" />
                      <span>Score: {user.Score}</span>
                    </div>
                  </div>
                </div>

                {/* View Profile Button */}
                <div className="mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openUserProfile(user)}
                    className="w-full"
                  >
                    View Profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Team Selection Modal */}
        {showTeamSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select a Team</h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose which team you want to invite this person to:
              </p>

              <div className="space-y-2 mb-6">
                {teams.map((team) => (
                  <label key={team._id} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="team"
                      value={team._id}
                      checked={selectedTeamId === team._id}
                      onChange={(e) => setSelectedTeamId(e.target.value)}
                      className="text-primary-600"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{team.teamName}</div>
                      <div className="text-sm text-gray-600">{team.Goal}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleTeamSelection}
                  className="flex-1"
                  disabled={!selectedTeamId}
                >
                  Send Invite
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTeamSelector(false);
                    setSelectedUserId(null);
                    setSelectedTeamId('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* User Profile Modal */}
        {showProfileModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedUser.Name}
                    </h2>
                    <p className="text-gray-600">{selectedUser.college}</p>
                    <div className="flex items-center text-gray-500 mt-1">
                      <Star className="w-4 h-4 mr-1" />
                      <span>Score: {selectedUser.Score}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProfileModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Bio */}
                {selectedUser.bio && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                    <p className="text-gray-600">{selectedUser.bio}</p>
                  </div>
                )}

                {/* Role */}
                {selectedUser.role && (
                  <div className="flex items-center text-gray-600">
                    <Award className="w-5 h-5 mr-2" />
                    <span className="font-medium">Role: {selectedUser.role}</span>
                  </div>
                )}

                {/* Expertise */}
                {selectedUser.expertise && (
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="w-5 h-5 mr-2" />
                    <span className="font-medium">Expertise: {selectedUser.expertise}</span>
                  </div>
                )}

                {/* Social Links */}
                {(selectedUser.githubLink || selectedUser.LinkdInLink) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Connect</h3>
                    <div className="space-y-2">
                      {selectedUser.githubLink && (
                        <div className="flex items-center text-gray-600">
                          <Github className="w-5 h-5 mr-3" />
                          <a
                            href={selectedUser.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary-600 flex items-center"
                          >
                            GitHub Profile
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        </div>
                      )}
                      {selectedUser.LinkdInLink && (
                        <div className="flex items-center text-gray-600">
                          <Linkedin className="w-5 h-5 mr-3" />
                          <a
                            href={selectedUser.LinkdInLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary-600 flex items-center"
                          >
                            LinkedIn Profile
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {selectedUser.experience && selectedUser.experience.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Experience</h3>
                    <div className="space-y-4">
                      {selectedUser.experience.map((exp, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                          <p className="text-gray-600">{exp.company}</p>
                          <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {selectedUser.projects && selectedUser.projects.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Projects</h3>
                    <div className="space-y-4">
                      {selectedUser.projects.map((project, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{project.title}</h4>
                              <p className="text-gray-600 mt-1">{project.description}</p>
                            </div>
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-700 ml-4"
                              >
                                <ExternalLink className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Join Date */}
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Joined: {formatDate(selectedUser.createdAt || new Date())}</span>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t">
                  <div className="flex space-x-3">
                    <Button
                      className="flex-1"
                      loading={sendingInvite[String(selectedUser._id)]}
                      onClick={() => handleSendInvite(selectedUser._id)}
                      disabled={sendingInvite[String(selectedUser._id)]}
                    >
                      Add to Team
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleWhatsApp(selectedUser.phoneNumber)}
                      className="flex-1"
                    >
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default People;
