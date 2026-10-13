import React from 'react';

const MovieOverview = ({ movie }) => {
  // Default values for missing properties
  const trailer = movie.trailer || (movie.trailers && movie.trailers.length > 0 ? movie.trailers[0].url : "");
  const cast = movie.cast || [];
  const director = movie.director || "Unknown";
  const showTimes = movie.showTimes || [];
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            
            {/* Trailer Section */}
            {trailer && (
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg mb-8">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Official Trailer</h2>
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <iframe 
                      src={trailer} 
                      title={`${movie.title} Trailer`}
                      className="w-full h-96"
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            )}
            
            {/* Cast Section removed */}
          </div>
          
          {/* Right Column - Details and Showtimes */}
          <div>
            {/* Movie Info */}
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Movie Info</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-orange-500 font-bold mb-1">Director</h3>
                    <p className="text-gray-300">jarry Ullah</p>
                  </div>
                  {movie.writers && (
                    <div>
                      <h3 className="text-orange-500 font-bold mb-1">Writers</h3>
                      <p className="text-gray-300">{movie.writers || "Unknown"}</p>
                    </div>
                  )}
                  {/* Stars section removed */}
                  <div>
                    <h3 className="text-orange-500 font-bold mb-1">Release Date</h3>
                    <p className="text-gray-300">{movie.releaseDate || "Coming Soon"}</p>
                  </div>
                  <div>
                    <h3 className="text-orange-500 font-bold mb-1">Language</h3>
                    <p className="text-gray-300">{movie.language || "English"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Showtimes */}
            {showTimes.length > 0 && (
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Showtimes</h2>
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Select Date</label>
                    <select className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>Today, April 6</option>
                      <option>Tomorrow, April 7</option>
                      <option>Wednesday, April 8</option>
                      <option>Thursday, April 9</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-300 mb-2">Available Times</label>
                    <div className="grid grid-cols-2 gap-2">
                      {showTimes.map((showTime, index) => (
                        <button 
                          key={index}
                          className={`py-2 px-3 rounded-lg text-center ${
                            showTime.available 
                              ? 'bg-gray-700 text-white hover:bg-orange-500 transition duration-300' 
                              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!showTime.available}
                        >
                          {showTime.time}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition duration-300">
                    Book Tickets
                  </button>
                </div>
              </div>
            )}
            
            {/* Coming Soon section removed as requested */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieOverview;
