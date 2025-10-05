import Button from "./Button"
import { Menu, Bell, ChevronDown, User, RotateCcw, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authentication.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="w-full  mx-auto flex items-center justify-between py-4 px-20 border border-[#DAD6D1]">
      <h1 className="h2 text-black">hh<span className="text-green">.</span></h1>

      {/* Desktop Navigation */}
      <div className="sm:flex gap-4 hidden items-center">
        {isAuthenticated ? (
          // User Profile Section
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem>
                  <Link to="/profile" className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings" className="w-full">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
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
      <DropdownMenu>
        <DropdownMenuTrigger className="sm:hidden focus:outline-none">
          <Menu className="w-6 h-6 text-gray-700" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="sm:hidden w-screen h-screen rounded-none mt-0 flex flex-col bg-stone-50 border-none shadow-lg">
          {isAuthenticated ? (
            // Mobile User Profile
            <div className="flex flex-col h-full">
              {/* User Profile Section */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                <img
                  src={user?.avatar || "/default-avatar.png"}
                  alt={user?.name || "User"}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{user?.name || "Moodeng ja"}</p>
                </div>
                <div className="relative">
                  <Bell className="w-6 h-6 text-gray-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="flex-1 p-4">
                <div className="space-y-4">
                  {/* Profile Link */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  {/* Reset Password Link */}
                  <Link
                    to="/reset-password"
                    className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span className="font-medium">Reset password</span>
                  </Link>
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
              {/* Header with Logo and Menu */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">
                  hh<span className="text-green-500">.</span>
                </h1>
                <Menu className="w-6 h-6 text-gray-700" />
              </div>

              {/* Login/Signup Buttons */}
              <div className="flex-1 p-4 flex flex-col justify-center gap-4">
                <Link
                  to="/signin"
                  className="px-8 py-4 bg-white rounded-full text-center text-gray-700 border border-gray-300 hover:border-gray-400 hover:text-gray-800 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-gray-800 text-center text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}

export default Navbar