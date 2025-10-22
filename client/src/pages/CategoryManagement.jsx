import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Filter, SortAsc, SortDesc } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import SuccessNotification from '../components/SuccessNotification';
import CoffeeLoading from '../components/CoffeeLoading';
import Pagination from '../components/Pagination';

const CategoryManagement = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name' only
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, categoryId: null, categoryName: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch categories from Supabase
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter and sort categories
  useEffect(() => {
    let filtered = categories;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy]?.toString().toLowerCase() || '';
      let bValue = b[sortBy]?.toString().toLowerCase() || '';

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCategories(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [categories, searchTerm, sortBy, sortOrder]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', deleteModal.categoryId);

      if (error) throw error;

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

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, categoryId: null, categoryName: '' });
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
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

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            />
          </div>
          
          {/* Sort Options */}
          <div className="flex gap-2">
            <button
              onClick={() => handleSort('name')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                sortBy === 'name' 
                  ? 'bg-brown-100 border-brown-300 text-brown-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-sm">Name</span>
              {sortBy === 'name' && (
                sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="text-sm font-medium text-gray-600">
            Category Name
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="px-6 py-8 text-center">
              <CoffeeLoading text="กำลังโหลดหมวดหมู่..." />
            </div>
          ) : currentCategories.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              {searchTerm ? 'No categories found matching your search.' : 'No categories found.'}
            </div>
          ) : (
            currentCategories.map((category, index) => (
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

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={filteredCategories.length}
        itemName="categories"
      />

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
