import React, { createContext, useState, useContext, useEffect } from 'react';
import { adminLoginRequest, adminRegisterRequest } from '../services/api';

// Create the admin auth context
const AdminAuthContext = createContext();

// Custom hook to use the admin auth context
export const useAdminAuth = () => {
  return useContext(AdminAuthContext);
};

export const AdminAuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(!!localStorage.getItem('adminToken'));

  // Restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedAdmin = localStorage.getItem('admin');

    if (storedToken && storedAdmin) {
      try {
        setAdminToken(storedToken);
        setCurrentAdmin(JSON.parse(storedAdmin));
        setIsAdminAuthenticated(true);
      } catch (e) {
        console.error('Error parsing admin from localStorage:', e);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
      }
    }
  }, []);

  // Admin login via the backend
  const adminLogin = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await adminLoginRequest(email, password);

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('admin', JSON.stringify(data.user));

      setCurrentAdmin(data.user);
      setAdminToken(data.token);
      setIsAdminAuthenticated(true);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Admin login failed');
      setLoading(false);
      return false;
    }
  };

  // Admin register via the backend
  const adminRegister = async (adminData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await adminRegisterRequest({
        name: adminData.name || `${adminData.firstName || ''} ${adminData.lastName || ''}`.trim() || 'Admin',
        email: adminData.email,
        password: adminData.password,
      });

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('admin', JSON.stringify(data.user));

      setCurrentAdmin(data.user);
      setAdminToken(data.token);
      setIsAdminAuthenticated(true);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Admin registration failed');
      setLoading(false);
      return false;
    }
  };

  // Admin logout
  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setCurrentAdmin(null);
    setAdminToken(null);
    setIsAdminAuthenticated(false);
  };

  const clearError = () => setError(null);

  const value = {
    currentAdmin,
    adminToken,
    isAdminAuthenticated,
    loading,
    error,
    adminLogin,
    adminRegister,
    adminLogout,
    clearError,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export default AdminAuthContext;
