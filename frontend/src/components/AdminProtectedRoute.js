import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated, loading } = useAdminAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to admin login
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default AdminProtectedRoute;
