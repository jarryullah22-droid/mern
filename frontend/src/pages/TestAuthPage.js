import React from 'react';
import { useAuth } from '../context/AuthContext';

const TestAuthPage = () => {
  const { 
    isAuthenticated, 
    currentUser, 
    login, 
    logout, 
    register, 
    error 
  } = useAuth();

  const handleTestLogin = async () => {
    // Test login with correct credentials
    console.log('Testing login with correct credentials');
    const success = await login('user@example.com', 'password123');
    console.log('Login result:', success);
  };

  const handleTestRegister = async () => {
    // Test registration with new user
    console.log('Testing registration with new user');
    const success = await register({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'test123'
    });
    console.log('Registration result:', success);
  };

  const handleTestLogout = () => {
    // Test logout
    console.log('Testing logout');
    logout();
  };

  return (
    <div className="bg-dark py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-secondary rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-6">Authentication Test</h2>
            
            <div className="mb-6 p-4 bg-gray-700 rounded">
              <h3 className="text-xl font-bold text-white mb-2">Current Auth State:</h3>
              <p className="text-white">
                <strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
              </p>
              {currentUser && (
                <div className="mt-2">
                  <p className="text-white"><strong>User ID:</strong> {currentUser.id}</p>
                  <p className="text-white"><strong>Name:</strong> {currentUser.name}</p>
                  <p className="text-white"><strong>Email:</strong> {currentUser.email}</p>
                </div>
              )}
              {error && (
                <p className="text-red-400 mt-2"><strong>Error:</strong> {error}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={handleTestLogin}
                className="w-full btn-primary py-3"
              >
                Test Login (user@example.com)
              </button>
              
              <button
                onClick={handleTestRegister}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition duration-300"
              >
                Test Register (test@example.com)
              </button>
              
              <button
                onClick={handleTestLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition duration-300"
              >
                Test Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAuthPage;
