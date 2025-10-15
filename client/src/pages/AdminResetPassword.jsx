import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import axios from 'axios';
import SuccessNotification from '../components/SuccessNotification';

const AdminResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = () => {
    if (!validateForm()) {
      return;
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmReset = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/admin/login');
        return;
      }

      await axios.post(
        'http://localhost:4001/auth/reset-password',
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Show success notification
      setShowSuccess(true);
      
      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Hide success notification after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error resetting password:', error);
      
      if (error.response?.status === 401) {
        setErrors({ currentPassword: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
      } else if (error.response?.status === 400) {
        setErrors({ currentPassword: error.response.data.message || 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelReset = () => {
    setShowConfirmModal(false);
  };

 
  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          
          <h1 className="h3 text-brown-600">Reset password</h1>
        </div>
        <button
          onClick={handleResetPassword}
          disabled={isLoading}
          className="px-6 py-2 bg-brown-600 text-white rounded-full hover:bg-brown-500 transition-colors disabled:opacity-50 b1"
        >
          {isLoading ? 'Resetting...' : 'Reset password'}
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block b1 text-brown-400 mb-2">
              Current password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Current password"
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent ${
                errors.currentPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block b1 text-brown-400 mb-2">
              New password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="New password"
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent ${
                errors.newPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block b1 text-brown-400 mb-2">
              Confirm new password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative">
            {/* Close button */}
            <button
              onClick={handleCancelReset}
              className="absolute top-4 right-4 text-brown-400 hover:text-brown-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal content */}
            <div className="text-center">
              <h2 className="h3 text-brown-600 mb-2">
                Reset password
              </h2>
              <p className="b1 text-brown-400 mb-6">
                Do you want to reset your password?
              </p>

              {/* Action buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCancelReset}
                  className="px-6 py-2 border border-gray-300 text-brown-600 rounded-full hover:bg-gray-50 transition-colors b1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReset}
                  className="px-6 py-2 bg-brown-600 text-white rounded-full hover:bg-brown-400 transition-colors b1"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      <SuccessNotification
        isVisible={showSuccess}
        title="Password reset"
        message="Your password has been successfully updated"
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
};

export default AdminResetPassword;
