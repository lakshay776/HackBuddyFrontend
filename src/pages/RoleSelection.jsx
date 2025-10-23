import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const handleRoleSelection = async (role) => {
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.updateProfile({ role });

      if (response) {
        // Update user context with new role
        updateUser({ role });

        // Redirect to hackathons page
        navigate('/hackathons');
      } else {
        setError('Failed to update role. Please try again.');
      }
    } catch (error) {
      setError('Failed to update role. Please try again.');
      console.error('Role update error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Setting up your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to HackMatch!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Choose your role to continue
          </p>
          <p className="text-gray-500">
            You can change this later in your profile settings
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Student Card */}
          <Card
            className={`p-8 cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedRole === 'Student'
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedRole('Student')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">I am a Student</h2>

              <p className="text-gray-600 mb-6">
                Join hackathons, collaborate with teams, and showcase your skills.
                Connect with other students and participate in exciting coding challenges.
              </p>

              <div className="space-y-3 text-left">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Join existing teams
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Register for hackathons
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  View all available hackathons
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Connect with other developers
                </div>
              </div>

              {selectedRole === 'Student' && (
                <div className="mt-6">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSelection('Student');
                    }}
                    className="w-full"
                    disabled={loading}
                  >
                    Continue as Student
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Admin Card */}
          <Card
            className={`p-8 cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedRole === 'Admin'
                ? 'ring-2 ring-purple-500 bg-purple-50'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedRole('Admin')}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">I am an Admin</h2>

              <p className="text-gray-600 mb-6">
                Organize hackathons, manage participants, and create opportunities
                for the developer community. Help build the next generation of innovators.
              </p>

              <div className="space-y-3 text-left">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Create new hackathons
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Manage hackathon registrations
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  View all participants
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Access admin dashboard
                </div>
              </div>

              {selectedRole === 'Admin' && (
                <div className="mt-6">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSelection('Admin');
                    }}
                    className="w-full"
                    disabled={loading}
                  >
                    Continue as Admin
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Not sure? You can change your role later in your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;

