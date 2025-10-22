import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import SuccessNotification from '../components/SuccessNotification';
import CoffeeLoading from '../components/CoffeeLoading';
import Pagination from '../components/Pagination';

const ArticleManagement = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, articleId: null, articleTitle: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch all articles from local server
  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/posts/admin', {
        params: {
          limit: 100 // Get all articles for admin management
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Format data from Supabase
      const formattedArticles = response.data.posts.map(post => ({
        id: post.id,
        title: post.title,
        description: post.description,
        content: post.content,
        image: post.image,
        category: post.categories?.name || 'Uncategorized',
        category_id: post.category_id,
        status_id: post.status_id,
        date: post.date,
        likes_count: post.likes_count || 0
      }));
      
      setArticles(formattedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  // Filter articles based on search and filters
  useEffect(() => {
    let filtered = articles;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      const statusMap = { 'published': 1, 'draft': 2 };
      filtered = filtered.filter(article => article.status_id === statusMap[statusFilter]);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(article => article.category === categoryFilter);
    }

    setFilteredArticles(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [articles, searchTerm, statusFilter, categoryFilter]);

  // Get unique categories for filter
  const uniqueCategories = [...new Set(articles.map(article => article.category))];

  // Pagination calculations
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

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


  const handleCreateArticle = () => {
    // Navigate to create article page
    navigate('/admin/articles/create');
  };

  const handleEditArticle = (articleId) => {
    // Navigate to edit article page
    navigate(`/admin/articles/edit/${articleId}`);
  };

  const handleDeleteClick = (articleId, articleTitle) => {
    setDeleteModal({ isOpen: true, articleId, articleTitle });
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/posts/${deleteModal.articleId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove from local state
      setArticles(articles.filter(article => article.id !== deleteModal.articleId));
      // Show success notification
      setSuccessMessage('Article deleted successfully');
      setShowSuccess(true);
      
      // Close modal
      setDeleteModal({ isOpen: false, articleId: null, articleTitle: '' });
      
      // Hide success notification after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, articleId: null, articleTitle: '' });
  };


  if (isLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="flex items-center justify-center h-64">
          <CoffeeLoading text="กำลังโหลดบทความ..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Article management</h1>
        <button
          onClick={handleCreateArticle}
          className="flex items-center gap-2 px-4 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-500 not-last:transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create article
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
            <div className="col-span-6">Article title</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {currentArticles.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'No articles found matching your criteria.'
                : 'No articles found.'}
            </div>
          ) : (
            currentArticles.map((article, index) => (
              <div key={article.id} className={`px-6 py-4 transition-colors ${
                index % 2 === 0 ? 'bg-brown-200' : 'bg-brown-100'
              } hover:bg-gray-100`}>
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Article Title */}
                  <div className="col-span-6">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {article.description}
                    </p>
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {article.category}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${article.status_id === 1 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <span className="text-sm text-gray-600">
                        {article.status_id === 1 ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditArticle(article.id)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit article"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(article.id, article.title)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete article"
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
        totalItems={filteredArticles.length}
        itemName="articles"
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        articleTitle={deleteModal.articleTitle}
      />

      {/* Success Notification */}
      <SuccessNotification
        isVisible={showSuccess}
        title="Delete article"
        message={successMessage}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
};

export default ArticleManagement;
