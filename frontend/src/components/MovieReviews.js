import React, { useState } from 'react';

const MovieReviews = () => {
  const [reviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    content: ''
  });

  const handleRatingChange = (rating) => {
    setReviewForm({...reviewForm, rating});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm({...reviewForm, [name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would submit the review to an API
    console.log('Review submitted:', reviewForm);
    // Reset form
    setReviewForm({
      rating: 0,
      title: '',
      content: ''
    });
    alert('Thank you for your review!');
  };

  // Function to render stars for ratings
  const renderStars = (rating, interactive = false) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button 
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => handleRatingChange(star) : undefined}
            className={interactive ? "focus:outline-none" : undefined}
          >
            <svg 
              className={`w-6 h-6 ${star <= rating ? 'text-primary' : 'text-gray-500'} ${interactive && 'hover:text-primary'}`} 
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="py-12 bg-dark">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">User Reviews</h2>
            <div className="h-1 w-20 bg-primary mt-2"></div>
          </div>
          <div className="flex items-center">
            <div className="mr-4">
              <span className="text-white font-bold text-xl">4.8</span>
              <span className="text-gray-400 text-sm">/5</span>
            </div>
            <div className="flex text-primary">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star}>★</span>
              ))}
            </div>
            <span className="text-gray-400 text-sm ml-2">(128 reviews)</span>
          </div>
        </div>
        
        {/* Write a Review */}
        <div className="bg-secondary rounded-xl p-6 mb-10">
          <h3 className="text-xl font-bold text-white mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Your Rating</label>
              <div className="flex items-center">
                {renderStars(reviewForm.rating, true)}
                <span className="text-gray-400 ml-2">
                  {reviewForm.rating > 0 ? `${reviewForm.rating}/5` : 'Select a rating'}
                </span>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-300 mb-2">Review Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={reviewForm.title}
                onChange={handleInputChange}
                placeholder="Summarize your thoughts"
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="content" className="block text-gray-300 mb-2">Your Review</label>
              <textarea
                id="content"
                name="content"
                value={reviewForm.content}
                onChange={handleInputChange}
                rows="5"
                placeholder="Share your experience with this movie"
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn-primary py-3 px-6"
              disabled={reviewForm.rating === 0}
            >
              Submit Review
            </button>
          </form>
        </div>
        
        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} className="bg-secondary rounded-xl p-6">
                <div className="flex items-start">
                  <img 
                    src={review.user.avatar} 
                    alt={review.user.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-bold">{review.user.name}</h4>
                        <div className="flex items-center mt-1">
                          {renderStars(review.rating)}
                          <span className="text-gray-400 text-sm ml-2">{review.user.date}</span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-3">{review.title}</h3>
                    <p className="text-gray-300 mt-2">{review.content}</p>
                    <div className="flex items-center mt-4 space-x-4">
                      <button className="flex items-center text-gray-400 hover:text-primary transition duration-300">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span>{review.likes}</span>
                      </button>
                      <button className="flex items-center text-gray-400 hover:text-red-500 transition duration-300">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2" />
                        </svg>
                        <span>{review.dislikes}</span>
                      </button>
                      <button className="flex items-center text-gray-400 hover:text-white transition duration-300">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-secondary rounded-xl p-8 text-center">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
              <h3 className="text-xl font-bold text-white mb-2">No Reviews Yet</h3>
              <p className="text-gray-400 mb-6">Be the first to review this movie!</p>
            </div>
          )}
        </div>
        
        {/* Load More Button - Only show if there are reviews */}
        {reviews.length > 0 && (
          <div className="text-center mt-10">
            <button className="bg-secondary hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieReviews;
