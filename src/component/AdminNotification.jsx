import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminNotification = () => {
  const navigate = useNavigate();
  const [notifications] = useState([
    {
      id: 1,
      type: 'comment',
      user: {
        name: 'Jacob Lash',
        avatar: '/src/assets/authorPhoto.jpg'
      },
      action: 'Commented on your article: The Fascinating World of Cats: Why We Love Our Furry Friends',
      content: 'I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.',
      time: '4 hours ago',
      articleId: 1
    },
    {
      id: 2,
      type: 'like',
      user: {
        name: 'Jacob Lash',
        avatar: '/src/assets/authorPhoto.jpg'
      },
      action: 'liked your article: The Fascinating World of Cats: Why We Love Our Furry Friends',
      content: null,
      time: '4 hours ago',
      articleId: 1
    }
  ]);

  const handleViewArticle = (articleId) => {
    navigate(`/post/${articleId}`);
  };

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="h3 text-brown-600">Notification</h1>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No notifications found.
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div key={notification.id} className={`px-6 py-4 ${
              index !== notifications.length - 1 ? 'border-b border-gray-200' : ''
            }`}>
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={notification.user.avatar}
                    alt={notification.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>

                {/* Notification Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* User Name and Action */}
                      <div className="mb-2">
                        <span className="font-semibold text-brown-600">
                          {notification.user.name}
                        </span>
                        <span className="text-gray-700 ml-1">
                          {notification.action}
                        </span>
                      </div>

                      {/* Comment Content (if exists) */}
                      {notification.content && (
                        <div className="mb-2">
                          <p className="text-gray-600 italic">
                            "{notification.content}"
                          </p>
                        </div>
                      )}

                      {/* Time */}
                      <div className="text-sm text-gray-500">
                        {notification.time}
                      </div>
                    </div>

                    {/* View Button */}
                    <div className="flex-shrink-0 ml-4">
                      <button
                        onClick={() => handleViewArticle(notification.articleId)}
                        className="text-brown-600 hover:text-brown-800 font-medium text-sm transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNotification;
