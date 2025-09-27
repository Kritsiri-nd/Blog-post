import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: ''
    });
    const [isEditing, setIsEditing] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                username: user.username || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);

        try {
            // Simulate API call to update profile
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update user data in context (in real app, this would come from API)
            // For now, we'll just show success

            setIsEditing(true);
            setShowSuccess(true);

            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);

        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form data to original user data
        setFormData({
            name: user.name || '',
            username: user.username || '',
            email: user.email || ''
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
        <div className="min-h-screen bg-brown-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 px-5">
                    <img
                        src={user?.avatar}
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
                                    src={user?.avatar}
                                    alt={user?.name}
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
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

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="w-full px-3 py-2 text-gray-600 bg-transparent">
                                        {formData.email}
                                    </div>
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

            {/* Success Notification */}
            {showSuccess && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="font-medium text-sm">Saved profile</p>
                            <p className="text-xs mt-1 opacity-90">Your profile has been successfully updated</p>
                        </div>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="ml-3 text-white hover:text-gray-200 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
