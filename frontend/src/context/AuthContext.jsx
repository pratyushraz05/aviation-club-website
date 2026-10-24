import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { AuthContext } from './authContextInstance';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aviation_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('aviation_auth_token') || null);
  const [loading, setLoading] = useState(true);

  // Verify auth session on initial load
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const { data } = await API.get('/auth/me');
        if (isMounted && data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('aviation_user', JSON.stringify(data.user));
        }
      } catch {
        // If session is invalid or expired
        if (isMounted) {
          setUser(null);
          setToken(null);
          localStorage.removeItem('aviation_user');
          localStorage.removeItem('aviation_auth_token');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    if (data.success && data.user) {
      setUser(data.user);
      localStorage.setItem('aviation_user', JSON.stringify(data.user));
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('aviation_auth_token', data.token);
      }
      return data.user;
    }
    throw new Error(data.message || 'Login failed');
  };

  const register = async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    if (data.success && data.user) {
      setUser(data.user);
      localStorage.setItem('aviation_user', JSON.stringify(data.user));
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('aviation_auth_token', data.token);
      }
      return data.user;
    }
    throw new Error(data.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.warn('Logout endpoint error (clearing local state anyway):', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('aviation_user');
      localStorage.removeItem('aviation_auth_token');
    }
  };

  const updateUserRole = async (userId, newRole) => {
    const { data } = await API.patch(`/auth/users/${userId}/role`, { role: newRole });
    if (data.success && user && user.id === userId) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      localStorage.setItem('aviation_user', JSON.stringify(updated));
    }
    return data.user;
  };

  const requestMembership = async (details) => {
    const { data } = await API.post('/auth/request-membership', details);
    if (data.success && data.user) {
      setUser(data.user);
      localStorage.setItem('aviation_user', JSON.stringify(data.user));
      return data.user;
    }
    throw new Error(data.message || 'Request failed');
  };

  const updateProfile = async (profileData) => {
    const { data } = await API.put('/auth/profile', profileData);
    if (data.success && data.user) {
      setUser(data.user);
      localStorage.setItem('aviation_user', JSON.stringify(data.user));
      return data.user;
    }
    throw new Error(data.message || 'Failed to update profile');
  };

  // Helper flags
  const isMember = user ? ['member', 'head', 'admin'].includes(user.role) : false;
  const isHead = user ? ['head', 'admin'].includes(user.role) : false;
  const isCommonUser = user ? user.role === 'user' : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUserRole,
        requestMembership,
        updateProfile,
        isMember,
        isHead,
        isCommonUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

