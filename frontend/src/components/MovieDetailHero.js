import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MovieDetailHero = ({ movie }) => {
  const [showTrailer, setShowTrailer] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState(
    movie.trailers && movie.trailers.length > 0 ? movie.trailers[0] : null
  );

  const openTrailer = () => {
    setShowTrailer(true);
  };

  const closeTrailer = () => {
    setShowTrailer(false);
  };

  // Get trailer URL from either movie.trailerUrl (admin panel), movie.trailer (old format) or movie.trailers array (new format)
  const hasTrailers = movie.trailers && movie.trailers.length > 0;
  const trailerUrl = movie.trailerUrl || (hasTrailers ? movie.trailers[0].url : movie.trailer);

  return (
    <div className="relative">
      {/* Movie Banner with Parallax Effect */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-10"></div>
        <img 
          src={movie.imageUrl || movie.banner || movie.backdrop || movie.poster} 
          alt={movie.title} 
          className="w-full h-full object-cover object-center transform scale-110"
        />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-end md:items-center gap-8">
              {/* Movie Poster */}
              <div className="w-48 md:w-64 flex-shrink-0 rounded-lg overflow-hidden shadow-2xl transform -translate-y-16 md:translate-y-0 border-4 border-gray-900">
                <img 
                  src={movie.imageUrl || movie.poster} 
                  alt={movie.title} 
                  className="w-full h-auto"
                />
              </div>
              
              {/* Movie Info */}
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {movie.genre}
                  </span>
                  <span className="bg-gray-800 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {movie.duration}
                  </span>
                  <span className="bg-gray-700 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {movie.releaseDate}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{movie.title}</h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-orange-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white font-bold">{movie.rating}/10</span>
                  </div>
                  <div className="text-gray-300">
                    Director: <span className="text-white">{movie.director}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Link 
                    to={`/ticket/${movie.id}`}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded flex items-center transition duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    Book Tickets
                  </Link>
                  {trailerUrl && (
                    <button 
                      onClick={openTrailer}
                      className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded flex items-center transition duration-300"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Watch Trailer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trailer Modal */}
      {showTrailer && trailerUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button 
              onClick={closeTrailer}
              className="absolute -top-10 right-0 text-white hover:text-orange-500 transition-colors duration-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative pt-[56.25%]">
              {trailerUrl.includes('youtube.com/embed') ? (
                <iframe 
                  className="absolute inset-0 w-full h-full rounded-lg"
                  src={`${trailerUrl}?autoplay=1`}
                  title={`${movie.title} Trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video 
                  className="absolute inset-0 w-full h-full rounded-lg"
                  src={trailerUrl}
                  title={`${movie.title} Trailer`}
                  controls
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailHero;
