import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import SuccessNotification from './SuccessNotification';

const AdminProfile = () => {
  const [formData, setFormData] = useState({
    name: 'Thompson P.',
    username: 'thompson',
    email: 'thompson.p@gmail.com',
    bio: 'I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness. When i\'m not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle file upload logic here
      console.log('File selected:', file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success notification
      setShowSuccess(true);
      
      // Hide success notification after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="h3 text-brown-600">Profile</h1>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-2 bg-brown-600 text-white rounded-full hover:bg-brown-500 transition-colors disabled:opacity-50 b1"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Profile Picture Section */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <img
              src="/src/assets/authorPhoto.jpg"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="profile-upload"
            />
            <button
              onClick={() => document.getElementById('profile-upload').click()}
              className="px-4 py-2  text-brown-600 rounded-full hover:bg-gray-50 transition-colors b1 border border-brown-300"
            >
              Upload profile picture
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200 mb-6"></div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block b1 text-brown-400 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block b1 text-brown-400 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block b1 text-brown-400 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block b1 text-brown-400 mb-2">
              Bio (max 120 letters)
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={6}
              maxLength={120}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent resize-none"
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {formData.bio.length}/120
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      <SuccessNotification
        isVisible={showSuccess}
        title="Saved profile"
        message="Your profile has been successfully updated"
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
};

export default AdminProfile;
