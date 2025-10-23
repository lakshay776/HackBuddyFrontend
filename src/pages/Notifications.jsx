import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Users, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';
import { teamsAPI } from '../api/teams';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responding, setResponding] = useState({});

  const { user } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await authAPI.getNotifications();
      console.log('Notifications response:', response);

      // Filter out any invalid notifications and ensure proper structure
      const validNotifications = Array.isArray(response)
        ? response.filter(notification =>
            notification &&
            notification.teamId &&
            notification.message &&
            notification.type &&
            notification.status !== 'Declined' &&
            notification.status !== 'Read'
          )
        : [];

      console.log('Valid notifications:', validNotifications);
      setNotifications(validNotifications);
    } catch (error) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToInvite = async (teamId, response) => {
    setResponding(prev => ({ ...prev, [teamId]: response }));

    try {
      await teamsAPI.respondInvite({
        teamId,
        response
      });

      // Refresh notifications
      await fetchNotifications();

      // Show success message
      alert(`Invitation ${response.toLowerCase()} successfully!`);
    } catch (error) {
      alert(`Failed to ${response.toLowerCase()} invitation. Please try again.`);
      console.error('Response error:', error);
    } finally {
      setResponding(prev => ({ ...prev, [teamId]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
          <Button onClick={fetchNotifications}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">Manage your team invitations and updates</p>
        </div>

        {notifications.length === 0 ? (
          <Card className="p-8 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-600">You're all caught up! Check back later for new invitations.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Team Invitation
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">
                      {notification.message}
                    </p>

                    {notification.type === 'Invite' && (
                      <div className="flex space-x-3">
                        <Button
                          size="sm"
                          onClick={() => handleRespondToInvite(notification.teamId, 'Accepted')}
                          disabled={responding[notification.teamId]}
                          className="flex items-center space-x-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRespondToInvite(notification.teamId, 'Rejected')}
                          disabled={responding[notification.teamId]}
                          className="flex items-center space-x-2"
                        >
                          <X className="w-4 h-4" />
                          <span>Decline</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
