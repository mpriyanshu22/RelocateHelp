import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// 1. Dynamic URL based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// 2. Global setting: This applies to ALL axios calls in this file
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      // Use template literal with API_BASE_URL
      const res = await axios.get(`${API_BASE_URL}/api/auth/me`);
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    // Removed duplicate { withCredentials: true } because of the global default above
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { 
      email, 
      password 
    });
    setUser(res.data.user);
  };

  const register = async (name, email, password, role = 'user') => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
      name,
      email,
      password,
      role
    });
    setUser(res.data.user);
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {});
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};