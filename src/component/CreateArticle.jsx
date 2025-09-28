import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ChevronDown } from 'lucide-react';

const CreateArticle = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    thumbnail: null,
    category: '',
    authorName: 'Thompson P.',
    title: '',
    introduction: '',
    content: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['General', 'Cat', 'Inspiration', 'Technology', 'Lifestyle'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        thumbnail: file
      }));
    }
  };

  const handleSaveAsDraft = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to save as draft
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Article saved as draft:', formData);
      navigate('/admin/articles');
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndPublish = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to save and publish
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Article published:', formData);
      navigate('/admin/articles');
    } catch (error) {
      console.error('Error publishing article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="h3  text-brown-600 ">Create article</h1>
        <div className="flex gap-3">
          <button
            onClick={handleSaveAsDraft}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 b1"
          >
            {isLoading ? 'Saving...' : 'Save as draft'}
          </button>
          <button
            onClick={handleSaveAndPublish}
            disabled={isLoading}
            className="px-6 py-2 bg-brown-600 text-white rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 b1"
          >
            {isLoading ? 'Publishing...' : 'Save and publish'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="space-y-6">
          {/* Thumbnail Image */}
          <label className="block b1 text-brown-400 mb-2">
              Thumbnail image
            </label>
          <div className='flex flex-row gap-4 items-end'>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center w-140 h-80 relative overflow-hidden">
              {formData.thumbnail ? (
                <div className="w-full h-full">
                  <img
                    src={URL.createObjectURL(formData.thumbnail)}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-4 h-4 text-brown-600 b1" />
                  </div>
                  <p className="text-xs text-gray-500">No image selected</p>
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="thumbnail-upload"
              />
              <button
                onClick={() => document.getElementById('thumbnail-upload').click()}
                className="px-3 py-1.5 border border-gray-300 text-brown-400 rounded-lg hover:bg-gray-50 transition-colors  b1"
              >
                Upload thumbnail image
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block b1 text-brown-400 mb-2">
              Category
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brown-400 pointer-events-none" />
            </div>
          </div>

          {/* Author Name */} 
          <div>
            <label className="block b1 text-brown-400 mb-2">
              Author name
            </label>
            <input
              type="text"
              name="authorName"
              value={formData.authorName}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-brown-400 cursor-not-allowed"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block b1 text-brown-400 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Article title"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            />
          </div>

          {/* Introduction */}
          <div>
            <label className="block b1 text-brown-400 mb-2">
              Introduction (max 120 letters)
            </label>
            <textarea
              name="introduction"
              value={formData.introduction}
              onChange={handleInputChange}
              placeholder="Introduction"
              rows={4}
              maxLength={120}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent resize-none"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.introduction.length}/120
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block b1 text-brown-400 mb-2">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Content"
              rows={12}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
