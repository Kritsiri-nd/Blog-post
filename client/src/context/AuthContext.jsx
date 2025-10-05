import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Mock user data
const MOCK_USERS = [
  {
    id: 1,
    name: "Moodeng ja",
    username: "moodeng.cute",
    email: "moodeng.cute@gmail.com",
    password: "123456",
    avatar: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Jane Smith",
    username: "janesmith",
    email: "jane@example.com",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in mock data
    const foundUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );
    
    if (foundUser) {
      const userData = { ...foundUser };
      delete userData.password; // Don't store password
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      return { success: true, user: userData };
    } else {
      setIsLoading(false);
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const signup = async (userData) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    const existingUser = MOCK_USERS.find(u => u.email === userData.email);
    if (existingUser) {
      setIsLoading(false);
      return { success: false, error: 'Email is already taken' };
    }
    
    // Check if username already exists
    const existingUsername = MOCK_USERS.find(u => u.username === userData.username);
    if (existingUsername) {
      setIsLoading(false);
      return { success: false, error: 'Username is already taken' };
    }
    
    // Create new user (in real app, this would be sent to API)
    const newUser = {
      id: MOCK_USERS.length + 1,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.random() * 1000000000}?w=100&h=100&fit=crop&crop=face`
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true, user: newUser };
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    signup,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
