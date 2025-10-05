import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const ArticleManagement = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, articleId: null, articleTitle: '' });

  // Fetch all articles
  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      // Fetch all articles without pagination
      const response = await axios.get('https://blog-post-project-api.vercel.app/posts', {
        params: {
          limit: 100 // Get more articles for admin management
        }
      });
      setArticles(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
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
      filtered = filtered.filter(article => article.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(article => article.category === categoryFilter);
    }

    setFilteredArticles(filtered);
  }, [articles, searchTerm, statusFilter, categoryFilter]);

  // Get unique categories for filter
  const categories = [...new Set(articles.map(article => article.category))];

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
      // In a real app, you would call the delete API here
      // await axios.delete(`https://blog-post-project-api.vercel.app/posts/${deleteModal.articleId}`);
      
      // For now, just remove from local state
      setArticles(articles.filter(article => article.id !== deleteModal.articleId));
      console.log('Article deleted:', deleteModal.articleId);
      
      // Close modal
      setDeleteModal({ isOpen: false, articleId: null, articleTitle: '' });
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
          <div className="text-gray-500">Loading articles...</div>
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
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            >
              <option value="all">Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            >
              <option value="all">Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
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
          {filteredArticles.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'No articles found matching your criteria.'
                : 'No articles found.'}
            </div>
          ) : (
            filteredArticles.map((article, index) => (
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
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Published</span>
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

      {/* Results Count */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredArticles.length} of {articles.length} articles
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        articleTitle={deleteModal.articleTitle}
      />
    </div>
  );
};

export default ArticleManagement;
