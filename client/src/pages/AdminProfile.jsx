import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authentication.jsx';
import { Upload } from 'lucide-react';
import axios from 'axios';
import SuccessNotification from '../components/SuccessNotification';
import { uploadProfileImage } from '../lib/imageUpload.js';

const AdminProfile = () => {
  const { user, fetchUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    profile_pic: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        profile_pic: user.profilePic || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profile_pic: file
      }));
      
      // Clear error when user selects file
      if (errors.profile_pic) {
        setErrors(prev => ({
          ...prev,
          profile_pic: ''
        }));
      }
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return;
      }

      // Prepare form data for API
      const updateData = {
        name: formData.name,
        username: formData.username,
        bio: formData.bio
      };

      // If profile picture is a file, upload to Supabase Storage
      if (formData.profile_pic instanceof File) {
        try {
          const imageUrl = await uploadProfileImage(formData.profile_pic, user.id);
          updateData.profile_pic = imageUrl;
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          setErrors({ profile_pic: 'Failed to upload image. Please try again.' });
          setIsLoading(false);
          return;
        }
      } else if (formData.profile_pic) {
        updateData.profile_pic = formData.profile_pic;
      }

      const response = await axios.put(
        '/auth/update-profile',
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Refresh user data
      await fetchUser();
      
      // Show success notification
      setShowSuccess(true);
      
      // Hide success notification after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      
      if (error.response?.status === 400) {
        setErrors({ username: error.response.data.error });
      }
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
              src={formData.profile_pic instanceof File ? URL.createObjectURL(formData.profile_pic) : (formData.profile_pic || "/src/assets/authorPhoto.jpg")}
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

          {/* Email - Read Only */}
          <div>
            <label className="block b1 text-brown-400 mb-2">
              Email
            </label>
            <div className="w-full px-4 py-3 text-gray-600 bg-gray-50 border border-gray-200 rounded-lg">
              {formData.email}
            </div>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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
