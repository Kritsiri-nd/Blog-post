import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ChevronDown } from 'lucide-react';
import axios from 'axios';
import SuccessNotification from '../components/SuccessNotification';
import { supabaseAdmin } from '../lib/supabase.js';

const CreateArticle = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    thumbnail: null,
    category_id: '',
    title: '',
    description: '',
    content: ''
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:4001/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        thumbnail: file
      }));
      
      // Clear error when user selects file
      if (errors.thumbnail) {
        setErrors(prev => ({
          ...prev,
          thumbnail: ''
        }));
      }
    }
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      // Use admin client to bypass RLS
      const { data, error } = await supabaseAdmin.storage
        .from('posts')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('posts')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.thumbnail) {
      newErrors.thumbnail = 'กรุณาอัปโหลดรูปภาพ';
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'กรุณาเลือกหมวดหมู่';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'กรุณากรอกหัวข้อ';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'กรุณากรอกคำอธิบาย';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'กรุณากรอกเนื้อหา';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status_id) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Validate form
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      // Check authentication
      if (!token) {
        navigate('/admin/login');
        return;
      }

      // Upload image if exists
      let imageUrl = '';
      if (formData.thumbnail) {
        try {
          imageUrl = await uploadImage(formData.thumbnail);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          return;
        }
      }

      const postData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category_id: parseInt(formData.category_id),
        image: imageUrl,
        status_id: status_id
      };

      await axios.post('http://localhost:4001/posts', postData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Show success notification
      setSuccessMessage(status_id === 1 ? 'Article published successfully' : 'Article saved as draft');
      setShowSuccess(true);
      
      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate('/admin/articles');
      }, 2000);
    } catch (error) {
      console.error('Error saving article:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsDraft = () => handleSave(2);
  const handleSaveAndPublish = () => handleSave(1);

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
            <div className={`border-2 border-dashed rounded-lg p-4 text-center w-140 h-80 relative overflow-hidden ${
              errors.thumbnail 
                ? 'border-red-500' 
                : 'border-blue-300'
            }`}>
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
          {errors.thumbnail && (
            <p className="mt-1 text-sm text-red-600">{errors.thumbnail}</p>
          )}

          {/* Category */}
          <div>
            <label className="block b1 text-brown-400 mb-2">Category</label>
            <div className="relative">
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className={`w-full appearance-none border rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-green ${
                  errors.category_id 
                    ? 'border-red-500' 
                    : 'border-gray-300'
                }`}
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brown-400 pointer-events-none" />
            </div>
            {errors.category_id && (
              <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block b1 text-brown-400 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Article title"
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green ${
                errors.title 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block b1 text-brown-400 mb-2">
              Introduction (max 120 letters)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              rows={4}
              maxLength={120}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green resize-none ${
                errors.description 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              }`}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.description.length}/120
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block b1 text-brown-400 mb-2">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Content"
              rows={12}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green resize-none ${
                errors.content 
                  ? 'border-red-500' 
                  : 'border-gray-300'
              }`}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification */}
      <SuccessNotification
        isVisible={showSuccess}
        title="Article saved"
        message={successMessage}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
};

export default CreateArticle;
