import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authentication';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

      const markAllAsRead = async () => {
        try {
          await axios.put('/notifications/read-all', {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          console.error('Failed to mark notifications as read:', error);
        }
      };

    if (user) {
      fetchNotifications();
      markAllAsRead();
    }
  }, [user, token]);

  const getNotificationMessage = (notification) => {
    const actorName = <span className="font-semibold">{notification.actor.name}</span>;
    const postTitle = <span className="font-semibold">{notification.post.title}</span>;

    switch (notification.type) {
      case 'like_post':
        return <>{actorName} liked your article: {postTitle}</>;
      case 'comment_post':
        return <>{actorName} commented on your article: {postTitle}</>;
      case 'new_post':
        return <>{actorName} published a new article: {postTitle}</>;
      default:
        return 'New notification';
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No new notifications</div>
        ) : (
          notifications.map((notif) => (
            <Link
              to={`/post/${notif.post.id}`}
              key={notif.id}
              onClick={onClose}
              className={`flex items-start gap-3 p-4 border-b hover:bg-gray-50 ${!notif.is_read ? 'bg-blue-50' : ''}`}
            >
              <img
                src={notif.actor.profile_pic || '/default-avatar.png'}
                alt={notif.actor.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-700">{getNotificationMessage(notif)}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;