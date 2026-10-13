import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, currentUser } = useAuth();
  const navigate = useNavigate();

  // Debug: Log authentication state changes
  useEffect(() => {
    console.log('Header auth state:', { isAuthenticated, currentUser });
  }, [isAuthenticated, currentUser]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    console.log('Logout button clicked');
    logout();
    navigate('/');
  };

  return (
    <header className="bg-secondary shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <span className="text-primary font-bold text-2xl">Movie Theater</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-white hover:text-primary transition duration-300">Home</Link>
            <Link to="/movies" className="text-white hover:text-primary transition duration-300">Movies</Link>
            <Link to="/gallery" className="text-white hover:text-primary transition duration-300">Gallery</Link>
            <Link to="/about" className="text-white hover:text-primary transition duration-300">About</Link>
            <Link to="/contact" className="text-white hover:text-primary transition duration-300">Contact</Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-white">Hello, {currentUser?.name || 'User'}</span>
                <button 
                  onClick={handleLogout} 
                  className="text-white hover:text-primary transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-primary transition duration-300">Login</Link>
                <Link to="/register" className="btn-primary">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-white hover:text-primary transition duration-300">Home</Link>
              <Link to="/movies" className="text-white hover:text-primary transition duration-300">Movies</Link>
              <Link to="/gallery" className="text-white hover:text-primary transition duration-300">Gallery</Link>
              <Link to="/about" className="text-white hover:text-primary transition duration-300">About</Link>
              <Link to="/contact" className="text-white hover:text-primary transition duration-300">Contact</Link>
              
              {isAuthenticated ? (
                <>
                  <span className="text-white">Hello, {currentUser?.name || 'User'}</span>
                  <button 
                    onClick={handleLogout} 
                    className="text-white hover:text-primary transition duration-300 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-white hover:text-primary transition duration-300">Login</Link>
                  <Link to="/register" className="btn-primary inline-block text-center">Register</Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
