import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        'http://localhost:5000/api/auth/me',
        {
          withCredentials: true
        }
      );

      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post(
      'http://localhost:5000/api/auth/login',
      { email, password },
      {
        withCredentials: true
      }
    );

    setUser(res.data.user);
  };

  const register = async (
    name,
    email,
    password,
    role = 'user'
  ) => {
    const res = await axios.post(
      'http://localhost:5000/api/auth/register',
      {
        name,
        email,
        password,
        role
      },
      {
        withCredentials: true
      }
    );

    setUser(res.data.user);
  };

  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/auth/logout',
        {},
        {
          withCredentials: true
        }
      );
    } catch (err) {
      console.error(err);
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