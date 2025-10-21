import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('/auth/get-user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/auth/login', {
        email,
        password
      });

      const token = response.data.access_token;
      localStorage.setItem('token', token);

      // Fetch user data
      const userResponse = await axios.get('/auth/get-user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(userResponse.data);
      return { success: true, user: userResponse.data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/auth/register', userData);
      
      setUser(null); // User needs to verify email
      return { success: true, user: response.data.user };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const token = localStorage.getItem('token');
      const response = await axios.put('/auth/update-profile', profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update local user state
      setUser(prev => ({
        ...prev,
        ...response.data.user
      }));

      return { success: true, user: response.data.user };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.response?.data?.error || 'Update failed' };
    }
  };

  const resetPassword = async (oldPassword, newPassword) => {
    try {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const token = localStorage.getItem('token');
      const response = await axios.put('/auth/reset-password', {
        oldPassword,
        newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.response?.data?.error || 'Reset failed' };
    }
  };

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const response = await axios.get('/auth/get-user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    token: localStorage.getItem('token'), // เพิ่มบรรทัดนี้
    login,
    logout,
    register,
    signup: register,
    updateProfile,
    resetPassword,
    fetchUser
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

