import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import SuccessNotification from '../components/SuccessNotification';

const CreateCategory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: ''
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

  const validateForm = () => {
    if (!formData.name.trim()) {
      return false;
    } else if (formData.name.trim().length < 2) {
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([
          {
            name: formData.name.trim()
          }
        ])
        .select();

      if (error) throw error;

      // Show success notification
      setShowSuccess(true);
      
      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate('/admin/categories');
      }, 2000);
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="h3 text-brown-600">Create category</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-2 bg-brown-600 text-white rounded-full hover:bg-brown-500 transition-colors disabled:opacity-50 b1"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <div className="space-y-6">
          {/* Category Name */}
          <div>
            <label className="block b1 text-brown-400 mb-2">
              Category name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter category name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            />
          </div>

        </div>
      </div>

      {/* Success Notification */}
      <SuccessNotification
        isVisible={showSuccess}
        title="Create category"
        message="Category has been successfully created."
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
};

export default CreateCategory;
