import React from 'react';
import { Link } from 'react-router-dom';

const PromoSection = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
          alt="Cinema Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-6 animate-pulse">
            Limited Time Offer
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">50% Discount For Students</h2>
          <p className="text-white text-lg md:text-xl mb-10 max-w-3xl mx-auto">
            Experience the magic of cinema with our special student discount. Valid student ID required at the box office. Enjoy the latest blockbusters at half the price!
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/movies" 
              className="bg-white text-primary font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Book Now
            </Link>
            <Link 
              to="/about" 
              className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white/10 transition duration-300 transform hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
    </section>
  );
};

export default PromoSection;
