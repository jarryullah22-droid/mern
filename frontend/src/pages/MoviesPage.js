import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import TicketBookingWidget from '../components/TicketBookingWidget';
import { fetchAllMoviesFromAdmin, fetchFeaturedMoviesFromAdmin, fetchComingSoonMoviesFromAdmin } from '../services/adminService';
import { useAuth } from '../context/AuthContext';

const genres = ["All", "Action", "Comedy", "Crime", "Drama", "Horror", "Sci-Fi", "Thriller"];

const MoviesPage = () => {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const { isAuthenticated } = useAuth();
  
  const [allMovies, setAllMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movie data from admin panel
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        // Fetch all movie data from the backend API
        const [allMoviesData, featuredMoviesData, comingSoonMoviesData] = await Promise.all([
          fetchAllMoviesFromAdmin(),
          fetchFeaturedMoviesFromAdmin(),
          fetchComingSoonMoviesFromAdmin(),
        ]);
        
        setAllMovies(Array.isArray(allMoviesData) ? allMoviesData : []);
        setFeaturedMovie((featuredMoviesData && featuredMoviesData[0]) || null);
        setComingSoonMovies(Array.isArray(comingSoonMoviesData) ? comingSoonMoviesData : []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch movie data from admin:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, []);

  // Filter movies based on genre and search term
  const filteredMovies = allMovies.filter(movie => {
    const matchesGenre = selectedGenre === "All" || movie.genre === selectedGenre;
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  // Sort movies based on sortBy value
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === "rating") {
      return parseFloat(b.rating) - parseFloat(a.rating);
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen flex justify-center items-center">
        <div className="text-center py-10">
          <p className="text-red-500 text-xl">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!featuredMovie) {
    return (
      <div className="bg-gray-900 min-h-screen flex justify-center items-center">
        <div className="text-center py-10">
          <p className="text-white text-xl">No featured movie available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900">
      {/* Hero Banner */}
      <div className="relative">
        <div className="h-[60vh] w-full bg-cover bg-center" style={{ backgroundImage: `url(${featuredMovie.imageUrl || featuredMovie.backdrop || featuredMovie.poster})` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="w-full md:w-2/3 lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{featuredMovie.title}</h1>
              <div className="flex items-center mb-4">
                <span className="text-orange-500 mr-2">★</span>
                <span className="text-white">{featuredMovie.rating}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-white">{featuredMovie.genre}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-white">{featuredMovie.duration}</span>
              </div>
              <p className="text-gray-300 mb-6 line-clamp-3">{featuredMovie.description}</p>
              <div className="flex space-x-4">
                <Link 
                  to={`/movie/${featuredMovie.id}`}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
                >
                  View Details
                </Link>
                {featuredMovie.trailers && featuredMovie.trailers.length > 0 && (
                  <button 
                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300 flex items-center"
                    onClick={() => {
                      // Open trailer in a modal or redirect to details page with trailer tab active
                      window.location.href = `/movie/${featuredMovie.id}?tab=trailers`;
                    }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Watch Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Notice */}
      {!isAuthenticated && (
        <div className="bg-gray-800 border-l-4 border-orange-500 p-4 mb-6 container mx-auto mt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-white">
                Please <Link to="/login" className="font-medium text-orange-500 hover:text-orange-400">log in</Link> to view movie details and book tickets.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 md:mb-0">Movies Now Playing</h2>
          
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  selectedGenre === genre 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content with Sidebar Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Movies Grid */}
          <div className="lg:w-3/4">
            {/* Search and Filter Section */}
            <div className="bg-gray-800 p-6 rounded-lg mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div>
                  <label htmlFor="search" className="block text-gray-300 mb-2">Search Movies</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      placeholder="Search by title..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Genre Filter */}
                <div>
                  <label htmlFor="genre" className="block text-gray-300 mb-2">Filter by Genre</label>
                  <select
                    id="genre"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                  >
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label htmlFor="sort" className="block text-gray-300 mb-2">Sort By</label>
                  <select
                    id="sort"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="rating">Rating (High to Low)</option>
                    <option value="title">Title (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Movies Grid */}
            {sortedMovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {sortedMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-800 rounded-lg">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-xl text-white">No movies found matching your criteria.</h3>
                <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
                <button 
                  onClick={() => {setSearchTerm(''); setSelectedGenre('All');}}
                  className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {sortedMovies.length > 0 && (
              <div className="flex justify-center mt-12">
                <nav className="flex space-x-2">
                  <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-300">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">1</button>
                  <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-300">2</button>
                  <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-300">3</button>
                  <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-300">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/4">
            {/* Ticket Booking Widget */}
            <TicketBookingWidget movieId={featuredMovie.id} movieTitle={featuredMovie.title} />
            
            {/* Coming Soon Section */}
            <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4">Coming Soon</h3>
              <div className="space-y-4">
                {comingSoonMovies.slice(0, 3).map(movie => (
                  <div key={movie.id} className="flex items-center space-x-3">
                    <img 
                      src={movie.imageUrl || movie.poster} 
                      alt={movie.title} 
                      className="w-16 h-24 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = movie.poster || 'https://via.placeholder.com/300x450?text=No+Image';
                      }}
                    />
                    <div>
                      <h4 className="text-white font-medium">{movie.title}</h4>
                      <p className="text-gray-400 text-sm">{movie.genre}</p>
                      <p className="text-orange-500 text-xs mt-1">Coming {movie.releaseDate}</p>
                      {movie.trailers && movie.trailers.length > 0 && (
                        <button 
                          className="text-gray-400 hover:text-white text-xs mt-1 flex items-center"
                          onClick={() => window.location.href = `/movie/${movie.id}?tab=trailers`}
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Watch Teaser
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <Link to="/coming-soon" className="block text-center text-orange-500 hover:text-orange-400 text-sm mt-4">
                  View All Upcoming Movies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;
