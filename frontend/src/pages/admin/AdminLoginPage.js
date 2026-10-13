import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { adminLogin, isAdminAuthenticated, loading, error, clearError } = useAdminAuth();
  
  // Get the redirect path from location state or default to admin dashboard
  const from = location.state?.from || '/admin/dashboard';
  
  // Debug: Log authentication state
  useEffect(() => {
    console.log('AdminLoginPage auth state:', { isAdminAuthenticated, error, redirectTo: from });
  }, [isAdminAuthenticated, error, from]);
  
  // If admin is already authenticated, redirect to the admin dashboard
  useEffect(() => {
    if (isAdminAuthenticated) {
      console.log('Admin is authenticated, redirecting to:', from);
      navigate(from);
    }
    
    // Clear any previous errors when component mounts
    return () => {
      clearError();
    };
  }, [isAdminAuthenticated, navigate, clearError, from]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting admin login form with:', formData);
    
    // For testing purposes, you can use these credentials:
    // Email: admin@example.com
    // Password: admin123
    
    const success = await adminLogin(formData.email, formData.password)
    console.log('Admin login result:', success);
    
    if (success) {
      // Redirect to the admin dashboard
      navigate(from);
    }
  };

  return (
    <div className="bg-dark py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-secondary rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-6">Admin Login</h2>
            
            {error && (
              <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-300 mb-2">Admin Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your admin email"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-600 rounded"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-gray-300">
                    Remember me
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                className={`w-full btn-primary py-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : 'Admin Login'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Need an admin account?{' '}
                <Link to="/admin/register" className="text-primary hover:underline">
                  Register
                </Link>
              </p>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-300 text-xs">
                This is an admin-only area. Regular users cannot access this section.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
