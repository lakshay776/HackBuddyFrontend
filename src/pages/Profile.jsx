import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Github, Linkedin, Calendar, Edit3, Save, X, Plus, Trash2, Briefcase, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    email: '',
    phoneNumber: '',
    bio: '',
    college: '',
    githubLink: '',
    LinkdInLink: '',
    expertise: '',
    DOB: ''
  });
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    link: ''
  });
  const [experienceForm, setExperienceForm] = useState({
    company: '',
    jobTitle: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        Name: user.Name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        bio: user.bio || '',
        college: user.college || '',
        githubLink: user.githubLink || '',
        LinkdInLink: user.LinkdInLink || '',
        expertise: user.expertise || '',
        DOB: user.DOB ? new Date(user.DOB).toISOString().split('T')[0] : ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.updateProfile(formData);
      if (response && response.success) {
        updateUser(formData);
        setIsEditing(false);
        setError(null);
        alert('Profile updated successfully!');
      } else {
        const errorMessage = response?.message || response?.error || 'Failed to update profile';
        setError(errorMessage);
      }
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      console.error('Update profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      Name: user.Name || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      bio: user.bio || '',
      college: user.college || '',
      githubLink: user.githubLink || '',
      LinkdInLink: user.LinkdInLink || '',
      expertise: user.expertise || '',
      DOB: user.DOB ? new Date(user.DOB).toISOString().split('T')[0] : ''
    });
    setIsEditing(false);
    setError(null);
    setShowAddProject(false);
    setShowAddExperience(false);
    setEditingProject(null);
    setEditingExperience(null);
  };

  const handleProjectFormChange = (e) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExperienceFormChange = (e) => {
    const { name, value } = e.target;
    setExperienceForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProject = async () => {
    if (!projectForm.title || !projectForm.description || !projectForm.link) {
      setError('Please fill in all project fields');
      return;
    }

    setLoading(true);
    try {
      const updatedUser = {
        ...user,
        projects: [...(user.projects || []), projectForm]
      };

      const response = await authAPI.updateProfile({ projects: updatedUser.projects });
      if (response && response.success) {
        updateUser(updatedUser);
        setProjectForm({ title: '', description: '', link: '' });
        setShowAddProject(false);
        setError(null); // Clear any previous errors
        alert('Project added successfully!');
      } else {
        const errorMessage = response?.message || response?.error || 'Failed to add project';
        setError(errorMessage);
      }
    } catch (error) {
      setError('Failed to add project. Please try again.');
      console.error('Add project error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExperience = async () => {
    if (!experienceForm.company || !experienceForm.jobTitle || !experienceForm.description) {
      setError('Please fill in all experience fields');
      return;
    }

    setLoading(true);
    try {
      const updatedUser = {
        ...user,
        experience: [...(user.experience || []), experienceForm]
      };

      const response = await authAPI.updateProfile({ experience: updatedUser.experience });
      if (response && response.success) {
        updateUser(updatedUser);
        setExperienceForm({ company: '', jobTitle: '', description: '' });
        setShowAddExperience(false);
        setError(null); // Clear any previous errors
        alert('Experience added successfully!');
      } else {
        const errorMessage = response?.message || response?.error || 'Failed to add experience';
        setError(errorMessage);
      }
    } catch (error) {
      setError('Failed to add experience. Please try again.');
      console.error('Add experience error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = (index) => {
    setEditingProject(index);
    setProjectForm(user.projects[index]);
  };

  const handleUpdateProject = async () => {
    if (!projectForm.title || !projectForm.description || !projectForm.link) {
      setError('Please fill in all project fields');
      return;
    }

    setLoading(true);
    try {
      const updatedProjects = [...user.projects];
      updatedProjects[editingProject] = projectForm;

      const response = await authAPI.updateProfile({ projects: updatedProjects });
      if (response && response.success) {
        updateUser({ ...user, projects: updatedProjects });
        setProjectForm({ title: '', description: '', link: '' });
        setEditingProject(null);
        setError(null);
        alert('Project updated successfully!');
      } else {
        const errorMessage = response?.message || response?.error || 'Failed to update project';
        setError(errorMessage);
      }
    } catch (error) {
      setError('Failed to update project. Please try again.');
      console.error('Update project error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (index) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    setLoading(true);
    try {
      const updatedProjects = user.projects.filter((_, i) => i !== index);

      const response = await authAPI.updateProfile({ projects: updatedProjects });
      if (response && response.success) {
        updateUser({ ...user, projects: updatedProjects });
        setError(null);
        alert('Project deleted successfully!');
      } else {
        const errorMessage = response?.message || response?.error || 'Failed to delete project';
        setError(errorMessage);
      }
    } catch (error) {
      setError('Failed to delete project. Please try again.');
      console.error('Delete project error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditExperience = (index) => {
    setEditingExperience(index);
    setExperienceForm(user.experience[index]);
  };

  const handleUpdateExperience = async () => {
    if (!experienceForm.company || !experienceForm.jobTitle || !experienceForm.description) {
      setError('Please fill in all experience fields');
      return;
    }

    setLoading(true);
    try {
      const updatedExperience = [...user.experience];
      updatedExperience[editingExperience] = experienceForm;

      const response = await authAPI.updateProfile({ experience: updatedExperience });
      if (response && response.success) {
        updateUser({ ...user, experience: updatedExperience });
        setExperienceForm({ company: '', jobTitle: '', description: '' });
        setEditingExperience(null);
        setError(null);
        alert('Experience updated successfully!');
      } else {
        const errorMessage = response?.message || response?.error || 'Failed to update experience';
        setError(errorMessage);
      }
    } catch (error) {
      setError('Failed to update experience. Please try again.');
      console.error('Update experience error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExperience = async (index) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    setLoading(true);
    try {
      const updatedExperience = user.experience.filter((_, i) => i !== index);

      const response = await authAPI.updateProfile({ experience: updatedExperience });
      if (response && response.success) {
        updateUser({ ...user, experience: updatedExperience });
        setError(null);
        alert('Experience deleted successfully!');
      } else {
        const errorMessage = response?.message || response?.error || 'Failed to delete experience';
        setError(errorMessage);
      }
    } catch (error) {
      setError('Failed to delete experience. Please try again.');
      console.error('Delete experience error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your profile information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {user.Name}
              </h2>
              <p className="text-gray-600 mb-2">{user.college}</p>
              {user.expertise && (
                <p className="text-sm text-gray-500 mb-4">{user.expertise}</p>
              )}
              <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Joined {formatDate(user.createdAt || new Date())}</span>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {user.Score}
                </div>
                <div className="text-sm text-gray-600">Score</div>
              </div>

              {/* Projects Display in Profile Overview */}
              {user.projects && user.projects.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Projects</h4>
                  <div className="space-y-3">
                    {user.projects.slice(0, 3).map((project, index) => (
                      <div key={index} className="text-center">
                        <h5 className="font-medium text-gray-900 text-sm">{project.title}</h5>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary-600 hover:text-primary-700 mt-1 inline-block"
                          >
                            View Project
                          </a>
                        )}
                      </div>
                    ))}
                    {user.projects.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{user.projects.length - 3} more projects
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Experience Display in Profile Overview */}
              {user.experience && user.experience.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Experience</h4>
                  <div className="space-y-3">
                    {user.experience.slice(0, 2).map((exp, index) => (
                      <div key={index} className="text-center">
                        <h5 className="font-medium text-gray-900 text-sm">{exp.jobTitle}</h5>
                        <p className="text-xs text-gray-600">{exp.company}</p>
                      </div>
                    ))}
                    {user.experience.length > 2 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{user.experience.length - 2} more experiences
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      loading={loading}
                      onClick={handleSave}
                      disabled={loading}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />

                <Input
                  label="Date of Birth"
                  type="date"
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />

                <Input
                  label="College"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <Input
                  label="Expertise"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="e.g., Frontend Developer, Data Scientist"
                />

                <Input
                  label="GitHub Profile"
                  type="url"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="https://github.com/username"
                />

                <Input
                  label="LinkedIn Profile"
                  type="url"
                  name="LinkdInLink"
                  value={formData.LinkdInLink}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Projects Section */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Projects</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddProject(true)}
                    disabled={isEditing}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </div>

                {/* Add Project Form */}
                {showAddProject && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-3">Add New Project</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Input
                        label="Project Title"
                        name="title"
                        value={projectForm.title}
                        onChange={handleProjectFormChange}
                        placeholder="Enter project title"
                        required
                      />
                      <Input
                        label="Project Link"
                        name="link"
                        type="url"
                        value={projectForm.link}
                        onChange={handleProjectFormChange}
                        placeholder="https://github.com/username/project"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={projectForm.description}
                        onChange={handleProjectFormChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Describe your project..."
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={handleAddProject}
                        loading={loading}
                        disabled={loading}
                      >
                        Add Project
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAddProject(false)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Existing Projects */}
                {user.projects && user.projects.length > 0 && (
                  <div className="space-y-4">
                    {user.projects.map((project, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        {editingProject === index ? (
                          <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <Input
                                label="Project Title"
                                name="title"
                                value={projectForm.title}
                                onChange={handleProjectFormChange}
                                required
                              />
                              <Input
                                label="Project Link"
                                name="link"
                                type="url"
                                value={projectForm.link}
                                onChange={handleProjectFormChange}
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                              </label>
                              <textarea
                                name="description"
                                value={projectForm.description}
                                onChange={handleProjectFormChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                required
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={handleUpdateProject}
                                loading={loading}
                                disabled={loading}
                              >
                                Update
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingProject(null)}
                                disabled={loading}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{project.title}</h5>
                              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                              {project.link && (
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-flex items-center"
                                >
                                  View Project
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              )}
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditProject(index)}
                                disabled={isEditing}
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteProject(index)}
                                disabled={isEditing}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Experience Section */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Experience</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddExperience(true)}
                    disabled={isEditing}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </div>

                {/* Add Experience Form */}
                {showAddExperience && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-3">Add New Experience</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Input
                        label="Job Title"
                        name="jobTitle"
                        value={experienceForm.jobTitle}
                        onChange={handleExperienceFormChange}
                        placeholder="Enter job title"
                        required
                      />
                      <Input
                        label="Company"
                        name="company"
                        value={experienceForm.company}
                        onChange={handleExperienceFormChange}
                        placeholder="Enter company name"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={experienceForm.description}
                        onChange={handleExperienceFormChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Describe your role and responsibilities..."
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={handleAddExperience}
                        loading={loading}
                        disabled={loading}
                      >
                        Add Experience
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAddExperience(false)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Existing Experience */}
                {user.experience && user.experience.length > 0 && (
                  <div className="space-y-4">
                    {user.experience.map((exp, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        {editingExperience === index ? (
                          <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <Input
                                label="Job Title"
                                name="jobTitle"
                                value={experienceForm.jobTitle}
                                onChange={handleExperienceFormChange}
                                required
                              />
                              <Input
                                label="Company"
                                name="company"
                                value={experienceForm.company}
                                onChange={handleExperienceFormChange}
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                              </label>
                              <textarea
                                name="description"
                                value={experienceForm.description}
                                onChange={handleExperienceFormChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                required
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={handleUpdateExperience}
                                loading={loading}
                                disabled={loading}
                              >
                                Update
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingExperience(null)}
                                disabled={loading}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{exp.jobTitle}</h5>
                              <p className="text-sm text-gray-600">{exp.company}</p>
                              <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditExperience(index)}
                                disabled={isEditing}
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteExperience(index)}
                                disabled={isEditing}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
