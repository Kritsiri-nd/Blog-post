import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, ChevronDown } from 'lucide-react';
import axios from 'axios';
import SuccessNotification from '../components/SuccessNotification';
import CoffeeLoading from '../components/CoffeeLoading';
import { supabase } from '../lib/supabase.js';

const EditArticle = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [formData, setFormData] = useState({
    thumbnail: null,
    existingImage: '',
    category_id: '',
    title: '',
    description: '',
    content: '',
    status_id: 1
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/posts/admin/${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const article = response.data;
        
        setFormData({
          thumbnail: null,
          existingImage: article.image || '',
          category_id: article.category_id || '',
          title: article.title || '',
          description: article.description || '',
          content: article.content || '',
          status_id: article.status_id || 1
        });
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchArticle();
    fetchCategories();
  }, [postId]);

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

      const { data, error } = await supabase.storage
        .from('posts')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
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
    
    if (!formData.thumbnail && !formData.existingImage) {
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

  const handleUpdate = async (status_id) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      // Validate form
      if (!validateForm()) {
        setIsSaving(false);
        return;
      }
      
      let imageUrl = formData.existingImage;

      // Upload new image if selected
      if (formData.thumbnail) {
        imageUrl = await uploadImage(formData.thumbnail);
      }

      const updateData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category_id: parseInt(formData.category_id),
        image: imageUrl,
        status_id: status_id
      };

      await axios.put(`/posts/${postId}`, updateData, {
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
      console.error('Error updating article:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAsDraft = () => handleUpdate(2);
  const handleSaveAndPublish = () => handleUpdate(1);

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
        <h1 className="h3 text-brown-600">Edit article</h1>
        <div className="flex gap-3">
          <button
            onClick={handleSaveAsDraft}
            disabled={isSaving}
            className="px-6 py-2 cursor-pointer border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 b1"
          >
            {isSaving ? 'Saving...' : 'Save as draft'}
          </button>
          <button
            onClick={handleSaveAndPublish}
            disabled={isSaving}
            className="px-6 py-2 cursor-pointer bg-brown-600 text-white rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 b1"
          >
            {isSaving ? 'Publishing...' : 'Save and publish'}
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
                <img
                  src={URL.createObjectURL(formData.thumbnail)}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : formData.existingImage ? (
                <img
                  src={formData.existingImage}
                  alt="Current thumbnail"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-2">
                  <Upload className="w-8 h-8 text-brown-600" />
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
                className="px-3 py-1.5 cursor-pointer border border-gray-300 text-brown-400 rounded-lg hover:bg-gray-50 transition-colors b1"
              >
                Upload new thumbnail
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
                className={`w-full cursor-pointer appearance-none border rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-green ${
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
        title="Article updated"
        message={successMessage}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
};

export default EditArticle;

