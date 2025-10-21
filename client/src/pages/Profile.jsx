import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authentication.jsx';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import axios from 'axios';
import SuccessNotification from '../components/SuccessNotification';
import { uploadProfileImage } from '../lib/imageUpload.js';

const Profile = () => {
    const { user, isAuthenticated, fetchUser } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        profile_pic: ''
    });
    const [isEditing, setIsEditing] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                username: user.username || '',
                email: user.email || '',
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
                username: formData.username
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
            setIsEditing(true);
            setShowSuccess(true);

            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);

        } catch (error) {
            console.error('Error updating profile:', error);
            
            if (error.response?.status === 400) {
                setErrors({ username: error.response.data.error });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form data to original user data
        setFormData({
            name: user.name || '',
            username: user.username || '',
            email: user.email || '',
            profile_pic: user.profilePic || ''
        });
        setIsEditing(true);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
                    <p className="text-gray-600">You need to be logged in to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Mobile Layout */}
            <div className="lg:hidden">
                {/* Top Navigation Tabs */}
                

                {/* User Info Header */}
                <div className="flex items-center justify-center gap-3 px-4 py-3 border-b border-gray-200">
                    <img
                        src={formData.profile_pic instanceof File ? URL.createObjectURL(formData.profile_pic) : (formData.profile_pic || user?.profilePic || user?.avatar)}
                        alt={user?.name}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-gray-600">{user?.name || "Moodeng ja"}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-sm font-bold text-gray-900">Profile</span>
                </div>

                {/* Main Content */}
                <div className="px-4 py-8">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center">
                        <img
                            src={formData.profile_pic instanceof File ? URL.createObjectURL(formData.profile_pic) : (formData.profile_pic || user?.avatar)}
                            alt={user?.name}
                            className="w-32 h-32 rounded-full object-cover mb-6"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="profile-upload-mobile"
                        />
                        <button 
                            onClick={() => document.getElementById('profile-upload-mobile').click()}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Upload profile picture
                        </button>
                    </div>

                    {/* Form */}
                    <div className="mt-8 space-y-6">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
                            />
                        </div>

                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
                            />
                        </div>

                        {/* Email Field - Read Only */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="w-full px-3 py-2 text-gray-600 bg-gray-50 border border-gray-200 rounded-lg">
                                {formData.email}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>

                        {/* Save Button */}
                        <div className="pt-4">
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8 px-5">
                        <img
                            src={formData.profile_pic instanceof File ? URL.createObjectURL(formData.profile_pic) : (formData.profile_pic || user?.profilePic || user?.avatar)}
                            alt={user?.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <span className="text-gray-600 text-xl">|</span>
                        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Sidebar Navigation */}
                        <div className="lg:w-64 flex-shrink-0">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                {/* Navigation */}
                                <nav className="space-y-2">
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg w-full text-left"
                                    >
                                        <User className="w-4 h-4" />
                                        Profile
                                    </button>
                                     <button
                                         onClick={() => navigate('/reset-password')}
                                         className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
                                     >
                                         <Lock className="w-4 h-4" />
                                         Reset password
                                     </button>
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            <div className="bg-brown-200 rounded-lg shadow-sm p-8">
                                {/* Profile Picture Section */}
                                <div className="flex items-center gap-6 mb-8">
                                    <img
                                        src={formData.profile_pic instanceof File ? URL.createObjectURL(formData.profile_pic) : (formData.profile_pic || user?.avatar)}
                                        alt={user?.name}
                                        className="w-24 h-24 rounded-full object-cover"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="profile-upload-desktop"
                                    />
                                    <button 
                                        onClick={() => document.getElementById('profile-upload-desktop').click()}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Upload profile picture
                                    </button>
                                </div>

                                {/* Divider */}
                                <hr className="border-gray-300 mb-8" />

                                {/* Form */}
                                <div className="space-y-6">
                                    {/* Name Field */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Name
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
                                        />
                                    </div>

                                    {/* Username Field */}
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                            Username
                                        </label>
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
                                        />
                                    </div>

                                    {/* Email Field - Read Only */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <div className="w-full px-3 py-2 text-gray-600 bg-gray-50 border border-gray-200 rounded-lg">
                                            {formData.email}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                    </div>

                                    {/* Save Button */}
                                    <div className="pt-4">
                                        <button
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </div>
                            </div>
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

export default Profile;
