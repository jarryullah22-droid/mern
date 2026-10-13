import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Hero slider data with beautiful movie backgrounds
const heroSlides = [
  {
    id: 1,
    title: "Experience The Magic of Cinema",
    subtitle: "50% Discount For Students",
    description: "Immerse yourself in stunning visuals and captivating stories on the big screen.",
    buttonText: "Book Now",
    buttonLink: "/movies",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
  },
  {
    id: 2,
    title: "Latest Blockbusters",
    subtitle: "Watch in IMAX & Dolby Atmos",
    description: "Experience the newest releases with cutting-edge sound and picture quality.",
    buttonText: "View Movies",
    buttonLink: "/movies",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
  },
  {
    id: 3,
    title: "Special Film Festivals",
    subtitle: "Celebrating World Cinema",
    description: "Join us for curated collections of award-winning international films.",
    buttonText: "Learn More",
    buttonLink: "/about",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="relative h-screen">
      {/* Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-4 h-full flex items-center relative z-20">
            <div className="max-w-2xl">
              <span className="inline-block bg-primary px-4 py-1 rounded-full text-white text-sm font-bold mb-4 animate-fadeIn">
                {slide.subtitle}
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-slideUp">
                {slide.title}
              </h1>
              <p className="text-xl text-gray-300 mb-8 animate-slideUp animation-delay-200">
                {slide.description}
              </p>
              <div className="flex space-x-4 animate-slideUp animation-delay-400">
                <Link 
                  to={slide.buttonLink} 
                  className="btn-primary text-lg px-8 py-3"
                >
                  {slide.buttonText}
                </Link>
                <Link 
                  to="/movies" 
                  className="border-2 border-white text-white font-bold text-lg px-8 py-3 rounded hover:bg-white hover:text-dark transition duration-300"
                >
                  View Trailers
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-primary text-white p-3 rounded-full transition duration-300"
        onClick={prevSlide}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-primary text-white p-3 rounded-full transition duration-300"
        onClick={nextSlide}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-primary w-10' : 'bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
