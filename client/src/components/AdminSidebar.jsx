import React from 'react';
import { useNavigate, useLocation,Link } from 'react-router-dom';
import { useAuth } from '../context/authentication.jsx';
import { 
  FileText, 
  FolderOpen, 
  User, 
  Bell, 
  Lock, 
  ExternalLink, 
  LogOut 
} from 'lucide-react';
import Lottie from "lottie-react";
import coffeeNavbar from "../assets/coffee-navbar.json";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      id: 'article-management',
      label: 'Article management',
      icon: FileText,
      path: '/admin/articles',
      active: location.pathname === '/admin/articles'
    },
    {
      id: 'category-management',
      label: 'Category management',
      icon: FolderOpen,
      path: '/admin/categories',
      active: location.pathname.startsWith('/admin/categories')
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/admin/profile',
      active: location.pathname === '/admin/profile'
    },
    {
      id: 'notification',
      label: 'Notification',
      icon: Bell,
      path: '/admin/notifications',
      active: location.pathname === '/admin/notifications'
    },
    {
      id: 'reset-password',
      label: 'Reset password',
      icon: Lock,
      path: '/admin/reset-password',
      active: location.pathname === '/admin/reset-password'
    }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleWebsiteClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    navigate('/');
    logout();
  };

  return (
    <div className="w-80 bg-brown-200 min-h-screen p-6 flex flex-col">
      {/* Logo and Brand */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
        <Link to="/" className="flex items-center gap-2  cursor-pointer transition-transform hover:scale-[1.02]">
        <div className="w-20 :h-20 flex-shrink-0">
          <Lottie
            animationData={coffeeNavbar}
            loop={true}
            autoplay={true}
            speed={1.1}
          />
        </div>
        <h1 className="h3 text-black font-semibold tracking-tight transition-transform hover:translate-x-1">Kritsiri<span className="text-green">.</span>Blog</h1>
      </Link>
        </div>
        <p className="text-sm text-orange-400 font-medium">Admin panel</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    item.active
                      ? 'bg-brown-300 text-gray-800'
                      : 'text-brown-500 hover:text-brown-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Links */}
      <div className="border-t border-gray-200 pt-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={handleWebsiteClick}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Kritsiri .N
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
