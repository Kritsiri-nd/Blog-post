import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authentication';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const AdminNotification = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter for notifications relevant to admin (likes/comments on their posts)
        const adminNotifications = response.data.notifications.filter(
          (n) => n.type === 'like_post' || n.type === 'comment_post'
        );
        setNotifications(adminNotifications);
      } catch (error) {
        console.error('Failed to fetch admin notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  const handleViewArticle = (postId) => {
    navigate(`/post/${postId}`);
  };

  const getNotificationText = (notification) => {
    const postTitle = <span className="font-semibold">{notification.post.title}</span>;
    if (notification.type === 'like_post') {
      return <>liked your article: {postTitle}</>;
    }
    if (notification.type === 'comment_post') {
      return <>commented on your article: {postTitle}</>;
    }
    return '';
  };

  return (
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="h3 text-gray-800">Notification</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="px-6 py-8 text-center text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            You have no new notifications.
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div key={notification.id} className={`px-6 py-4 ${
              index !== notifications.length - 1 ? 'border-b border-gray-200' : ''
            }`}>
              <div className="flex items-start gap-4">
                <img
                  src={notification.actor.profile_pic || '/src/assets/default-user.jpg'}
                  alt={notification.actor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-gray-800">
                        <span className="font-semibold">{notification.actor.name}</span>{' '}
                        {getNotificationText(notification)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewArticle(notification.post.id)}
                      className="text-orange-500 hover:text-orange-700 font-semibold text-sm transition-colors ml-4"
                    >
                      View
                    </button>
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
