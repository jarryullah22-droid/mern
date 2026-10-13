import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const [showTrailer, setShowTrailer] = useState(false);
  
  const openTrailer = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTrailer(true);
  };
  
  const closeTrailer = () => {
    setShowTrailer(false);
  };

  return (
    <div className="movie-card bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <Link to={`/movie/${movie.id}`}>
        <div className="relative">
          <img 
            src={movie.imageUrl || movie.poster} 
            alt={movie.title} 
            className="w-full h-96 object-cover transition-all duration-300 hover:brightness-75"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = movie.poster || 'https://via.placeholder.com/300x450?text=No+Image';
            }}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black opacity-70"></div>
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-md text-sm font-bold shadow-md">
            {movie.rating}
          </div>
          <div className="absolute bottom-3 left-3 text-white">
            <span className="bg-black bg-opacity-70 text-xs px-2 py-1 rounded-full">{movie.genre}</span>
          </div>
          <div className="absolute bottom-3 right-3 text-white">
            <span className="bg-black bg-opacity-70 text-xs px-2 py-1 rounded-full">{movie.duration}</span>
          </div>
          
          {/* Play Trailer Button */}
          {movie.trailers && movie.trailers.length > 0 && (
            <button 
              onClick={openTrailer}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-white truncate">{movie.title}</h3>
          <div className="flex items-center mt-2">
            <div className="flex text-orange-500">
              {[1, 2, 3, 4, 5].map((star, index) => {
                // Convert rating to number
                const rating = parseFloat(movie.rating);
                // Full star, half star or empty star
                const filled = index < Math.floor(rating / 2);
                const halfFilled = !filled && index < Math.ceil(rating / 2);
                
                return (
                  <span key={index} className="text-sm">
                    {filled ? '★' : halfFilled ? '★' : '☆'}
                  </span>
                );
              })}
            </div>
            <span className="text-gray-400 text-xs ml-2">({movie.rating}/10)</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 pointer-events-none"></div>
      </Link>
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
        <button className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium transform translate-y-8 hover:translate-y-0 transition-transform duration-300">
          Book Ticket
        </button>
        {movie.trailers && movie.trailers.length > 0 && (
          <button 
            onClick={openTrailer}
            className="bg-gray-700 text-white px-4 py-1 rounded-full text-sm font-medium transform translate-y-8 hover:translate-y-0 transition-transform duration-300 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Trailer
          </button>
        )}
      </div>
      
      {/* Trailer Modal */}
      {showTrailer && movie.trailers && movie.trailers.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg overflow-hidden w-full max-w-4xl">
            <div className="p-4 flex justify-between items-center border-b border-gray-800">
              <h3 className="text-white font-bold">{movie.title} - {movie.trailers[0].title}</h3>
              <button 
                onClick={closeTrailer}
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                src={movie.trailers[0].url} 
                title={`${movie.title} Trailer`}
                className="w-full h-96"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            {movie.trailers[0].description && (
              <div className="p-4 border-t border-gray-800">
                <p className="text-gray-300">{movie.trailers[0].description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
