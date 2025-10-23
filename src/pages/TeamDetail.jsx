import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, Clock, Trophy, Heart, MessageCircle } from 'lucide-react';
import { teamsAPI } from '../api/teams';
import { hackathonsAPI } from '../api/hackathons';
import { authAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import CountdownTimer from '../components/CountdownTimer';

const TeamDetail = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likingUsers, setLikingUsers] = useState({});

  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchTeamDetails();
    fetchHackathons();
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      const response = await teamsAPI.getMyTeams();
      const teamData = response.find(t => t._id === teamId);
      if (teamData) {
        setTeam(teamData);
      } else {
        setError('Team not found');
      }
    } catch (error) {
      setError('Failed to fetch team details');
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHackathons = async () => {
    try {
      const response = await hackathonsAPI.getAllHackathons();
      setHackathons(response || []);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    }
  };


  const getNextHackathon = () => {
    if (!team || !team.hackathonsRegistered || team.hackathonsRegistered.length === 0) return null;

    // Find all registered hackathons that are in the future
    const futureHackathons = hackathons
      .filter(hackathon =>
        team.hackathonsRegistered.includes(hackathon._id) &&
        new Date(hackathon.EventDate) > new Date()
      )
      .sort((a, b) => new Date(a.EventDate) - new Date(b.EventDate));

    return futureHackathons.length > 0 ? futureHackathons[0] : null;
  };

  const getRegisteredHackathons = () => {
    if (!team || !team.hackathonsRegistered || team.hackathonsRegistered.length === 0) return [];

    return hackathons.filter(hackathon =>
      team.hackathonsRegistered.includes(hackathon._id)
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLikeUser = async (userId) => {
    setLikingUsers(prev => ({ ...prev, [userId]: true }));

    try {
      await authAPI.likeUser(userId);
      // Refresh team data to get updated likes
      await fetchTeamDetails();
    } catch (error) {
      console.error('Error liking user:', error);
      alert('Failed to like user. Please try again.');
    } finally {
      setLikingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };

  const hasUserLiked = (member) => {
    if (!member.users?.likes?.likedBy || !currentUser?._id) return false;
    return member.users.likes.likedBy.some(likedById =>
      likedById.toString() === currentUser._id.toString()
    );
  };

  const isCurrentUser = (member) => {
    return member.users?._id === currentUser?._id;
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
          <Button onClick={() => navigate('/teams')}>Back to Teams</Button>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Not Found</h2>
          <Button onClick={() => navigate('/teams')}>Back to Teams</Button>
        </div>
      </div>
    );
  }

  const nextHackathon = getNextHackathon();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/teams')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Button>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{team.teamName}</h1>
            <p className="text-gray-600 text-lg">{team.Goal}</p>

            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center text-gray-500">
                <Users className="w-5 h-5 mr-2" />
                <span>{team.members?.length || 0} members</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Calendar className="w-5 h-5 mr-2" />
                <span>Created: {formatDate(team.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Registered Hackathons */}
        {(() => {
          const registeredHackathons = getRegisteredHackathons();
          const nextHackathon = getNextHackathon();

          return (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Registered Hackathons</h2>

              {registeredHackathons.length === 0 ? (
                <Card className="p-8 text-center">
                  <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Hackathons Registered</h3>
                  <p className="text-gray-600">This team hasn't registered for any hackathons yet.</p>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Next Hackathon Countdown */}
                  {nextHackathon && (
                    <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                            Next Hackathon: {nextHackathon.HackathonName}
                          </h3>
                          <p className="text-gray-600">
                            Event Date: {formatDate(nextHackathon.EventDate)}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Organized by {nextHackathon.organizer}
                          </p>
                        </div>
                        <div className="text-center">
                          <CountdownTimer
                            targetDate={nextHackathon.EventDate}
                            className="text-blue-600"
                          />
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* All Registered Hackathons */}
                  <div className="grid gap-4">
                    {registeredHackathons.map((hackathon) => (
                      <Card key={hackathon._id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{hackathon.HackathonName}</h4>
                            <p className="text-sm text-gray-600">{hackathon.organizer}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(hackathon.EventDate)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              new Date(hackathon.EventDate) > new Date()
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {new Date(hackathon.EventDate) > new Date() ? 'Upcoming' : 'Completed'}
                            </span>
                            {new Date(hackathon.EventDate) > new Date() && (
                              <div className="mt-2">
                                <CountdownTimer
                                  targetDate={hackathon.EventDate}
                                  className="text-sm text-gray-600"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <h2 className="col-span-full text-2xl font-bold text-gray-900 mb-4">Team Members</h2>

          {team.members?.map((member, index) => {
            const hasLiked = hasUserLiked(member);
            const likesCount = member.users?.likes?.count || 0;
            const isSelf = isCurrentUser(member);

            return (
              <Card key={index} className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.users?.Name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {member.users?.Name || `Member ${index + 1}`}
                      {isSelf && <span className="text-xs text-gray-500 ml-2">(You)</span>}
                    </h3>
                    <p className="text-sm text-gray-600">{member.users?.email}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    member.role === 'Team Leader'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.role}
                  </span>

                  {!isSelf && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Heart className={`w-4 h-4 mr-1 ${hasLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                      <span>{likesCount} likes</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  {!isSelf ? (
                    <Button
                      size="sm"
                      variant={hasLiked ? "outline" : "default"}
                      onClick={() => handleLikeUser(member.users._id)}
                      loading={likingUsers[member.users._id]}
                      disabled={likingUsers[member.users._id]}
                      className="flex-1"
                    >
                      <Heart className={`w-4 h-4 mr-1 ${hasLiked ? 'text-red-500 fill-current' : ''}`} />
                      {hasLiked ? 'Liked' : 'Like'}
                    </Button>
                  ) : (
                    <div className="flex-1 text-center text-sm text-gray-500 py-2">
                      Cannot like your own profile
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
