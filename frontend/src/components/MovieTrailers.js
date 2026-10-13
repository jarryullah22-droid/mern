import React, { useState, useEffect, useRef } from 'react';

const MovieTrailers = ({ movie }) => {
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const fullScreenRef = useRef(null);
  
  // Handle escape key to exit full screen
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isFullScreen]);

  // Prevent body scrolling when in full screen mode
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFullScreen]);
  
  // Initialize active trailer
  useEffect(() => {
    // Check if there's a trailer URL from the admin panel
    if (movie.trailerUrl && (!movie.trailers || movie.trailers.length === 0)) {
      // Create a trailer object for the admin panel trailer
      const adminTrailer = {
        title: `${movie.title} - Official Trailer`,
        url: movie.trailerUrl,
        description: `Official trailer for ${movie.title}`,
        duration: '2:30'
      };
      
      // Set it as the active trailer
      setActiveTrailer(adminTrailer);
      
      // Create a trailers array with just this trailer
      movie.trailers = [adminTrailer];
    } else if (movie.trailers && movie.trailers.length > 0) {
      setActiveTrailer(movie.trailers[0]);
    }
  }, [movie]);
  
  // If no trailers are available
  if (!movie.trailers || movie.trailers.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg p-6 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
          </svg>
          <h2 className="text-2xl font-bold text-white mb-4">No Trailers Available</h2>
          <p className="text-gray-300">Trailers for this movie will be added soon.</p>
        </div>
      </div>
    );
  }
  
  // If active trailer is not set yet, show loading
  if (!activeTrailer) {
    return <div className="bg-gray-900 p-6 rounded-xl">Loading trailer...</div>;
  }

  const handleTrailerChange = (trailer) => {
    setActiveTrailer(trailer);
    // Scroll to top of trailer section
    window.scrollTo({
      top: document.getElementById('main-trailer').offsetTop - 100,
      behavior: 'smooth'
    });
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // handleEscKey function moved to useEffect at the top of the component

  return (
    <div>
      {/* Main Trailer */}
      <div id="main-trailer" className="bg-gray-800 rounded-xl overflow-hidden shadow-lg mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">{activeTrailer.title}</h2>
            <button 
              onClick={toggleFullScreen}
              className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path>
              </svg>
              Full Screen
            </button>
          </div>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
            {activeTrailer.url.includes('youtube.com/embed') ? (
              <iframe 
                src={activeTrailer.url} 
                title={`${movie.title} - ${activeTrailer.title}`}
                className="w-full h-96"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            ) : (
              <video 
                src={activeTrailer.url} 
                title={`${movie.title} - ${activeTrailer.title}`}
                className="w-full h-96"
                controls
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <div className="mt-4">
            {activeTrailer.description && (
              <p className="text-gray-300 mt-2">{activeTrailer.description}</p>
            )}
            <div className="flex items-center mt-3 text-sm text-gray-400">
              {activeTrailer.duration && (
                <span className="flex items-center mr-4">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {activeTrailer.duration}
                </span>
              )}
              <button 
                onClick={() => {
                  // Copy trailer link to clipboard
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="flex items-center text-gray-400 hover:text-orange-500 transition-colors duration-300"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* All Trailers */}
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">All Trailers & Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movie.trailers.map((trailer, index) => (
              <div 
                key={index} 
                className={`group cursor-pointer transition-all duration-300 transform hover:scale-105 ${activeTrailer.url === trailer.url ? 'ring-2 ring-orange-500 rounded-lg' : ''}`}
                onClick={() => handleTrailerChange(trailer)}
              >
                <div className="relative rounded-lg overflow-hidden mb-3">
                  {/* Thumbnail with play button overlay */}
                  <div className="aspect-w-16 aspect-h-9 bg-gray-900">
                    {/* We're using a div with background instead of iframe for thumbnails */}
                    <div 
                      className="w-full h-full bg-cover bg-center"
                      style={{ 
                        backgroundImage: trailer.url.includes('youtube.com/embed') 
                          ? `url(https://img.youtube.com/vi/${trailer.url.split('/').pop()}/hqdefault.jpg)`
                          : `url(${movie.imageUrl || movie.poster})`,
                        backgroundSize: 'cover'
                      }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-orange-500 bg-opacity-90 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <h3 className="text-white font-bold group-hover:text-orange-500 transition duration-300 truncate">{trailer.title}</h3>
                    {trailer.duration && (
                      <p className="text-gray-400 text-sm mt-1">{trailer.duration}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Screen Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center" ref={fullScreenRef}>
          <div className="relative w-full h-full max-w-7xl mx-auto p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">{activeTrailer.title}</h2>
              <button 
                onClick={toggleFullScreen}
                className="text-white hover:text-orange-500 transition duration-300"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="flex-grow flex items-center justify-center">
              {activeTrailer.url.includes('youtube.com/embed') ? (
                <iframe 
                  src={activeTrailer.url} 
                  title={`${movie.title} - ${activeTrailer.title} (Full Screen)`}
                  className="w-full h-full max-h-[80vh]"
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : (
                <video 
                  src={activeTrailer.url} 
                  title={`${movie.title} - ${activeTrailer.title} (Full Screen)`}
                  className="w-full h-full max-h-[80vh]"
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

export default MovieTrailers;
