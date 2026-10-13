import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, fetchCurrentUser } from '../services/api';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // On mount, restore the session from a stored token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setCurrentUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    // Verify the token with the backend in the background
    if (storedToken) {
      fetchCurrentUser()
        .then((data) => {
          if (data && data.user) {
            setCurrentUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        })
        .catch(() => {
          // Token invalid/expired — clear the session
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setCurrentUser(null);
          setToken(null);
          setIsAuthenticated(false);
        });
    }
  }, []);

  // Login via the backend
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(email, password);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setCurrentUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
      return false;
    }
  };

  // Register via the backend
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await registerUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setCurrentUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
      return false;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const clearError = () => setError(null);

  const value = {
    currentUser,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
