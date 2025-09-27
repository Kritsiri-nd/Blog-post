import Button from "./Button"
import { Menu, Bell, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
          <Menu />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="sm:hidden w-screen rounded-none mt-4 flex flex-col gap-6 py-10 px-6 border-none bg-white">
          {isAuthenticated ? (
            // Mobile User Profile
            <>
              <div className="flex items-center gap-3 px-4 py-2">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">@{user?.username}</p>
                </div>
              </div>
              <Link
                to="/profile"
                className="px-8 py-4 bg-white rounded-full text-center text-foreground border border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="px-8 py-4 bg-white rounded-full text-center text-foreground border border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="px-8 py-4 bg-foreground bg-brown-600 text-center text-white rounded-full hover:bg-muted-foreground transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            // Mobile Login/Signup
            <>
              <Link
                to="/signin"
                className="px-8 py-4 bg-white rounded-full text-center text-foreground border border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-8 py-4 bg-foreground bg-brown-600 text-center text-white rounded-full hover:bg-muted-foreground transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}

export default Navbar