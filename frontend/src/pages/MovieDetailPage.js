import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import MovieDetailHero from '../components/MovieDetailHero';
import MovieOverview from '../components/MovieOverview';
import MovieReviews from '../components/MovieReviews';
import MovieTrailers from '../components/MovieTrailers';
import { fetchMovieByIdFromAdmin } from '../services/adminService';

const MovieDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        // Get movie data based on ID from the backend
        const movieData = await fetchMovieByIdFromAdmin(id);
        setMovie(movieData);
        
        // Check if there's a tab parameter in the URL
        const params = new URLSearchParams(location.search);
        const tabParam = params.get('tab');
        if (tabParam) {
          setActiveTab(tabParam);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch movie data from admin:', err);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieData();
  }, [id, location.search]);
  
  // If movie data is not loaded yet, show loading
  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-xl">Loading movie details...</p>
        </div>
      </div>
    );
  }
  
  // If there was an error loading the movie data
  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // If no movie was found
  if (!movie) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl">Movie not found</p>
        </div>
      </div>
    );
  }

  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <MovieOverview movie={movie} />;
      case 'reviews':
        return <MovieReviews />;
      case 'trailers':
        return <MovieTrailers movie={movie} />;
      default:
        return <MovieOverview movie={movie} />;
    }
  };

  return (
    <div className="bg-gray-900">
      {/* Movie Detail Hero Section */}
      <MovieDetailHero movie={movie} />
      
      {/* Tab Navigation */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <button 
              className={`px-6 py-4 font-medium border-b-2 transition duration-300 ${activeTab === 'overview' ? 'text-white border-orange-500' : 'text-gray-400 border-transparent hover:text-white'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`px-6 py-4 font-medium border-b-2 transition duration-300 ${activeTab === 'trailers' ? 'text-white border-orange-500' : 'text-gray-400 border-transparent hover:text-white'}`}
              onClick={() => setActiveTab('trailers')}
            >
              Trailers
            </button>
            <button 
              className={`px-6 py-4 font-medium border-b-2 transition duration-300 ${activeTab === 'reviews' ? 'text-white border-orange-500' : 'text-gray-400 border-transparent hover:text-white'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MovieDetailPage;
