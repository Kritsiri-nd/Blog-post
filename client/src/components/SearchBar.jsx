import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchIcon from '../assets/Search.png';
import { useAuth } from '../context/authentication.jsx';

const SearchBar = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim().length > 0) {
        performSearch(searchTerm);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (keyword) => {
    setIsLoading(true);
    try {
      console.log('Searching for:', keyword);
      // ใช้ API endpoint ที่ถูกต้องตาม role
      const apiUrl = (user?.role === 'admin') 
        ? '/posts/admin' 
        : '/posts';
      
      const response = await axios.get(apiUrl, {
        params: {
          keyword: keyword,
          limit: 6 // Limit results for dropdown
        },
        headers: (user?.role === 'admin') ? {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        } : {}
      });
      console.log('Search response:', response.data);
      setSearchResults(response.data.posts || []);
      setShowDropdown(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Error searching posts:', error);
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleResultClick = (post) => {
    navigate(`/post/${post.id}`);
    setSearchTerm('');
    setSearchResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleResultClick(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchResults.length > 0) {
              setShowDropdown(true);
            }
          }}
          placeholder="Search"
          className="w-full max-w-[350px] px-4 py-2 pl-10 pr-4 text-sm border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent bg-white"
        />
        <img
          src={SearchIcon}
          alt="Search"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-60"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && searchResults.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {searchResults.map((post, index) => (
            <div
              key={post.id}
              onClick={() => handleResultClick(post)}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                index === selectedIndex
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="inline-block px-2 py-1 text-xs bg-green-light text-green rounded-full">
                      {post.categories?.name || 'General'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(post.date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {showDropdown && searchTerm.trim().length > 0 && searchResults.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            No articles found for "{searchTerm}"
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
