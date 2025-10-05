import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SuccessNotification from '../components/SuccessNotification';

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Load category data from Supabase
    // TODO: Implement Supabase integration
  }, [id]);

  const handleSave = async () => {
    if (!categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
              Category name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category name"
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
