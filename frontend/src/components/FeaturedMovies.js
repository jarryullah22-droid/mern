import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import { fetchFeaturedMoviesFromAdmin } from '../services/adminService';

const FeaturedMovies = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeaturedMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchFeaturedMoviesFromAdmin();
        setFeaturedMovies(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch featured movies from admin:', err);
        setError('Failed to load featured movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedMovies();
  }, []);
  
  return (
    <section className="py-16 bg-gradient-to-b from-dark to-secondary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">Top Featured Movies</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredMovies.map(movie => (
            <div key={movie.id} className="group">
              <div className="movie-card overflow-hidden transform transition-all duration-500 group-hover:scale-105">
                <Link to={`/movie/${movie.id}`} className="block relative">
                  <div className="relative overflow-hidden">
                    <img 
                      src={movie.imageUrl || movie.poster} 
                      alt={movie.title} 
                      className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = movie.poster || 'https://via.placeholder.com/300x450?text=No+Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-sm font-bold">
                      {movie.rating}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">{movie.title}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-300 text-sm">{movie.genre}</span>
                      <span className="text-gray-300 text-sm">{movie.duration}</span>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-primary font-medium">{movie.releaseDate}</span>
                      <span className="bg-secondary/50 text-white text-xs px-3 py-1 rounded-full">
                        Now Playing
                      </span>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-primary/80 text-white rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-500">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
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

export default FeaturedMovies;
