import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState(null); // 'success', 'error', or null
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (subscribeStatus) {
      setSubscribeStatus(null);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setSubscribeStatus('error');
      return;
    }
    
    // Show loading state
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Newsletter subscription from footer:', email);
      
      // Reset form and show success message
      setEmail('');
      setSubscribeStatus('success');
      setLoading(false);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubscribeStatus(null);
      }, 5000);
    }, 1000);
  };

  return (
    <footer className="bg-secondary pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Movie Theater</h3>
            <p className="text-gray-300 mb-4">
              Your ultimate destination for the latest movies and entertainment news.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-primary">Home</Link></li>
              <li><Link to="/movies" className="text-gray-300 hover:text-primary">Movies</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Filter by Genre</h3>
            <ul className="space-y-2">
              <li><Link to="/movies?genre=action" className="text-gray-300 hover:text-primary">Action</Link></li>
              <li><Link to="/movies?genre=comedy" className="text-gray-300 hover:text-primary">Comedy</Link></li>
              <li><Link to="/movies?genre=drama" className="text-gray-300 hover:text-primary">Drama</Link></li>
              <li><Link to="/movies?genre=horror" className="text-gray-300 hover:text-primary">Horror</Link></li>
              <li><Link to="/movies?genre=sci-fi" className="text-gray-300 hover:text-primary">Sci-Fi</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            
            {subscribeStatus === 'success' && (
              <div className="bg-green-600 text-white p-2 rounded mb-3 text-sm flex items-center">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Thanks for subscribing!</span>
              </div>
            )}
            
            {subscribeStatus === 'error' && (
              <div className="bg-red-600 text-white p-2 rounded mb-3 text-sm flex items-center">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Please enter a valid email</span>
              </div>
            )}
            
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className={`px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary ${subscribeStatus === 'error' ? 'border-2 border-red-500' : ''}`}
                value={email}
                onChange={handleEmailChange}
                required
              />
              <button 
                type="submit" 
                disabled={loading}
                className={`btn-primary flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subscribing...
                  </>
                ) : 'Subscribe'}
              </button>
            </form>
            

          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} Movie Theater. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
