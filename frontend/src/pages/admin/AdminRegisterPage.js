import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminRegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  const [passwordError, setPasswordError] = useState('');
  
  const navigate = useNavigate();
  const { adminRegister, isAdminAuthenticated, loading, error, clearError } = useAdminAuth();
  
  // Debug: Log authentication state
  useEffect(() => {
    console.log('AdminRegisterPage auth state:', { isAdminAuthenticated, error });
  }, [isAdminAuthenticated, error]);
  
  // If admin is already authenticated, redirect to admin dashboard
  useEffect(() => {
    if (isAdminAuthenticated) {
      console.log('Admin is authenticated, redirecting to dashboard');
      navigate('/admin/dashboard');
    }
    
    // Clear any previous errors when component mounts
    return () => {
      clearError();
    };
  }, [isAdminAuthenticated, navigate, clearError]);

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
    
    // Clear password error when user types in password fields
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
    
    // Admin code field removed
  };

  const validateForm = () => {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    // Simplified password validation - just check for minimum length
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    
    // Admin code validation removed
    
    // Check if terms are agreed
    if (!formData.agreeTerms) {
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting admin registration form with:', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: '(hidden)',
      // adminCode field removed
    });
    
    if (validateForm()) {
      const success = await adminRegister({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password
      });
      
      console.log('Admin registration result:', success);
      
      if (success) {
        navigate('/admin/dashboard');
      }
    } else {
      console.log('Form validation failed:', passwordError);
    }
  };

  return (
    <div className="bg-dark py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-secondary rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-6">Create Admin Account</h2>
            
            {error && (
              <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
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
                  placeholder="Create a password"
                  className={`w-full px-4 py-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 ${passwordError ? 'ring-red-500' : 'focus:ring-primary'}`}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Password must be at least 6 characters long.
                </p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 ${passwordError ? 'ring-red-500' : 'focus:ring-primary'}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {passwordError && (
                  <p className="text-xs text-red-500 mt-1">
                    {passwordError}
                  </p>
                )}
              </div>
              
              {/* Admin Code field removed */}
              
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-600 rounded"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="agreeTerms" className="ml-2 block text-gray-300 text-sm">
                    I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
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
                    Registering...
                  </span>
                ) : 'Register as Admin'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Already have an admin account?{' '}
                <Link to="/admin/login" className="text-primary hover:underline">
                  Login
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

export default AdminRegisterPage;
