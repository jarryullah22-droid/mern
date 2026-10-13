import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchLatestMoviesFromAdmin } from '../services/adminService';

const LatestMovies = () => {
  const [latestMovies, setLatestMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLatestMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchLatestMoviesFromAdmin();
        setLatestMovies(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch latest movies from admin:', err);
        setError('Failed to load latest movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadLatestMovies();
  }, []);
  return (
    <section className="py-16 bg-dark relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">Movies Now Playing</h2>
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
          {latestMovies.map(movie => (
            <div key={movie.id} className="group">
              <div className="bg-secondary rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:translate-y-[-10px]">
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
                    <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur-sm text-white px-2 py-1 rounded-md text-sm font-bold">
                      {movie.rating}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white truncate">{movie.title}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-300 text-sm">{movie.genre}</span>
                        <span className="text-gray-300 text-sm">{movie.duration}</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="bg-primary/80 text-white rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-500">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestMovies;
