import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          // Validate token with server
          const response = await fetch(API_ENDPOINTS.profile, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            // Update with fresh data from server
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
          } else {
            // Token invalid or expired - clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (error) {
          // Server is down - clear storage to prevent unauthorized access
          console.error('Auth validation error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const login = async (email, password) => {
    const response = await fetch(API_ENDPOINTS.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    showNotification('Login successful!');
    return data;
  };

  const register = async (email, password, role = 'user') => {
    const response = await fetch(API_ENDPOINTS.register, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle validation errors with details
      if (data.details && Array.isArray(data.details)) {
        const errorMessages = data.details.map((err) => `${err.field}: ${err.message}`).join(', ');
        throw new Error(errorMessages || data.error || 'Registration failed');
      }
      throw new Error(data.message || data.error || 'Registration failed');
    }

    showNotification('Registration successful! Please login.');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    showNotification('Logged out successfully!');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, notification }}>
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
