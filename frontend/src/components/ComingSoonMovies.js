import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchComingSoonMoviesFromAdmin } from '../services/adminService';

const ComingSoonMovies = () => {
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComingSoonMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchComingSoonMoviesFromAdmin();
        setComingSoonMovies(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch coming soon movies from admin:', err);
        setError('Failed to load coming soon movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadComingSoonMovies();
  }, []);
  return (
    <section className="py-16 bg-gradient-to-b from-secondary to-dark">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">Movies Coming Soon</h2>
            <div className="h-1 w-20 bg-primary mt-2"></div>
          </div>
          <Link to="/movies" className="text-primary hover:text-white transition duration-300 flex items-center">
            View All 
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {comingSoonMovies.map(movie => (
            <div key={movie.id} className="group">
              <div className="bg-dark rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-primary transition-all duration-500 group-hover:translate-y-[-10px]">
                <Link to={`/movie/${movie.id}`} className="block relative">
                  <div className="relative overflow-hidden">
                    <img 
                      src={movie.imageUrl || movie.poster} 
                      alt={movie.title} 
                      className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = movie.poster || 'https://via.placeholder.com/300x450?text=No+Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                    <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold">
                      Coming Soon
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white truncate">{movie.title}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-300 text-sm">{movie.genre}</span>
                        <span className="text-primary text-sm font-medium">{movie.releaseDate}</span>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="p-4 border-t border-gray-800">
                  <button className="w-full bg-dark hover:bg-primary text-white font-medium py-2 rounded transition duration-300 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Get Notified
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ComingSoonMovies;
