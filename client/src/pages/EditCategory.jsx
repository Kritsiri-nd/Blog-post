import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import SuccessNotification from '../components/SuccessNotification';
import CoffeeLoading from '../components/CoffeeLoading';

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      setIsLoadingData(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        name: data.name || ''
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      navigate('/admin/categories');
    } finally {
      setIsLoadingData(false);
    }
  };

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
        .update({
          name: formData.name.trim()
        })
        .eq('id', id)
        .select();

      if (error) throw error;

      // Show success notification
      setShowSuccess(true);
      
      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate('/admin/categories');
      }, 2000);
    } catch (error) {
      console.error('Error updating category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/categories');
  };

  if (isLoadingData) {
    return (
      <div className="flex-1 p-8">
        <div className="flex items-center justify-center h-64">
          <CoffeeLoading text="กำลังโหลดหมวดหมู่..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="h3 text-brown-600">Edit category</h1>
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
        title="Update category"
        message="Category has been successfully updated."
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
};

export default EditCategory;
