import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, Users, Code, Zap, ArrowRight, Star, Brain, BarChart3, Crown, Sun, Moon, Target, Rocket } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const features = [
    {
      icon: Users,
      title: 'Find Your Perfect Team',
      description: 'Connect with like-minded developers who share your passion and complement your skills.'
    },
    {
      icon: Trophy,
      title: 'Hackathon Discovery',
      description: 'Discover exciting hackathons and register your team with ease.'
    },
    {
      icon: Target,
      title: 'Skill-Based Matching',
      description: 'Get matched with developers based on your skills, experience, and project interests.'
    },
    {
      icon: Rocket,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with built-in team management and communication tools.'
    }
  ];

  const futureFeatures = [
    {
      icon: Brain,
      title: 'AI Matchmaking',
      description: 'Advanced AI algorithms to find your ideal teammates based on skills, personality, and working style.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track your team\'s performance, hackathon participation, and skill development over time.'
    },
    {
      icon: Crown,
      title: 'Live Leaderboards',
      description: 'Real-time leaderboards during hackathons with live scoring and progress tracking.'
    },
    {
      icon: Code,
      title: 'Competition Platform',
      description: 'Expand beyond hackathons to competitive programming, AI/ML challenges, and technical competitions.'
    }
  ];

  const stats = [
    { label: 'Active Hackathons', value: '50+' },
    { label: 'Registered Teams', value: '200+' },
    { label: 'Active Users', value: '1000+' },
    { label: 'Success Stories', value: '100+' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Build Amazing Things
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                Together
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with developers, form teams, and participate in hackathons. 
              Turn your ideas into reality with the perfect team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/hackathons">
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore Hackathons
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools you need to find teammates, 
              discover hackathons, and build amazing projects.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} hover className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already building the future.
          </p>
          {!isAuthenticated && (
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-50">
                Join Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">HackBuddy</span>
            </div>
            <p className="text-gray-400">
              Building the future, one hackathon at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
