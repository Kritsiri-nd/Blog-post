import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import SuccessNotification from './SuccessNotification';

const CategoryManagement = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([
    { id: 1, name: 'Cat' },
    { id: 2, name: 'General' },
    { id: 3, name: 'Inspiration' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, categoryId: null, categoryName: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Filter categories based on search
  useEffect(() => {
    if (searchTerm) {
      setFilteredCategories(categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredCategories(categories);
    }
  }, [categories, searchTerm]);

  const handleCreateCategory = () => {
    navigate('/admin/categories/create');
  };

  const handleEditCategory = (categoryId) => {
    navigate(`/admin/categories/edit/${categoryId}`);
  };

  const handleDeleteClick = (categoryId, categoryName) => {
    setDeleteModal({ isOpen: true, categoryId, categoryName });
  };

  const handleDeleteConfirm = async () => {
    try {
      // Remove from local state
      setCategories(categories.filter(category => category.id !== deleteModal.categoryId));
      
      // Show success notification
      setSuccessMessage('Category has been successfully deleted.');
      setShowSuccess(true);
      
      // Close modal
      setDeleteModal({ isOpen: false, categoryId: null, categoryName: '' });
      
      // Hide success notification after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, categoryId: null, categoryName: '' });
  };

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="h3 text-brown-600">Category management</h1>
        <button
          onClick={handleCreateCategory}
          className="flex items-center gap-2 px-4 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create category
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="text-sm font-medium text-gray-600">
            Category
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {filteredCategories.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              {searchTerm ? 'No categories found matching your search.' : 'No categories found.'}
            </div>
          ) : (
            filteredCategories.map((category, index) => (
              <div key={category.id} className={`px-6 py-4 transition-colors ${
                index % 2 === 0 ? 'bg-brown-200' : 'bg-brown-100'
              } hover:bg-gray-100`}>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">
                    {category.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditCategory(category.id)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category.id, category.name)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        articleTitle={deleteModal.categoryName}
        type="category"
      />

      {/* Success Notification */}
      <SuccessNotification
        isVisible={showSuccess}
        title="Delete category"
        message={successMessage}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
};

export default CategoryManagement;
