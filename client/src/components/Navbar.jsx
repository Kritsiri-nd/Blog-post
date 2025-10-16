import React, { useState, useEffect } from "react";
import Button from "./Button"
import { Menu, Bell, ChevronDown, User, RotateCcw, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authentication.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx";
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

function Navbar() {
  const { user, isAuthenticated, logout, token } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false); // Close mobile menu after logout
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const fetchUnreadStatus = async () => {
      if (!user) return;
      try {
        const response = await axios.get('http://localhost:4001/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const unread = response.data.notifications.some(n => !n.is_read);
        setHasUnread(unread);
      } catch (error) {
        console.error('Failed to fetch unread status:', error);
      }
    };

    fetchUnreadStatus();
    const interval = setInterval(fetchUnreadStatus, 60000); // Check for new notifications every 60 seconds

    return () => clearInterval(interval);
  }, [user, token]);

  const handleNotificationClick = () => {
    setShowNotifications(prev => !prev);
    if (hasUnread) {
        setHasUnread(false); // Optimistically update UI
    }
  };

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
      // Close notification dropdown if clicking outside
      if (showNotifications && !event.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, showNotifications]);

  return (
    <nav className="w-full  mx-auto flex items-center justify-between py-4 px-20 border border-[#DAD6D1]">
      <h1 className="h2 text-black">hh<span className="text-green">.</span></h1>

      {/* Desktop Navigation */}
      <div className="sm:flex gap-4 hidden items-center">
        {isAuthenticated ? (
          // User Profile Section
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative notification-container">
              <button onClick={handleNotificationClick} className="focus:outline-none">
                <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
                {hasUnread && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>}
              </button>
              {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
            </div>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 focus:outline-none hover:bg-gray-50 p-2 rounded-lg">
                  <img
                    src={user?.profilePic || "/default-avatar.png"}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/reset-password" className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset Password
                  </Link>
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Admin panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 ">
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          // Login/Signup Buttons
          <>
            <Link to="/signin">
              <Button variant="secondary">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary">Sign up</Button>
            </Link>
          </>
        )}
      </div>
      {/* Mobile Navigation */}
      <div className="sm:hidden mobile-menu-container">
        <button
          onClick={toggleMobileMenu}
          className="focus:outline-none"
        >
          <Menu className="w-6 h-6 text-gray-700 relative" />
        </button>
        {isMobileMenuOpen && (
          <div className="absolute right-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            {isAuthenticated ? (
              // Mobile User Profile
              <div className="flex flex-col h-full">
                {/* User Profile Section */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                  <img
                    src={user?.profilePic || "/default-avatar.png"}
                    alt={user?.name || "User"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{user?.name || "Moodeng ja"}</p>
                  </div>
                  <div className="relative notification-container">
                    <button onClick={handleNotificationClick} className="focus:outline-none">
                        <Bell className="w-6 h-6 text-gray-600" />
                        {hasUnread && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>}
                    </button>
                    {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
                  </div>
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 p-4">
                  <div className="space-y-4">
                    {/* Profile Link */}
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    {/* Reset Password Link */}
                    <Link
                      to="/reset-password"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span className="font-medium">Reset password</span>
                    </Link>
                    {/* Admin Panel Link - Only for admin users */}
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Admin panel</span>
                      </Link>
                    )}
                  </div>
                  {/* Separator */}
                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Log out</span>
                  </button>
                </div>
              </div>
            ) : (
              // Mobile Login/Signup
              <div className="flex flex-col h-full">
                {/* Login/Signup Buttons */}
                <div className="flex-1 p-4 flex flex-col justify-center gap-4">
                  <Link
                    to="/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-8 py-4 bg-white rounded-full text-center text-gray-700 border border-gray-300 hover:border-gray-400 hover:text-gray-800 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-8 py-4 bg-gray-800 text-center text-white rounded-full hover:bg-gray-700 transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar