import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedMovies from '../components/FeaturedMovies';
import LatestMovies from '../components/LatestMovies';
import NewsArticles from '../components/NewsArticles';
import ComingSoonMovies from '../components/ComingSoonMovies';
import PhotoGallery from '../components/PhotoGallery';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Latest News Section */}
      <NewsArticles />

      {/* Movies Now Playing */}
      <LatestMovies />

      {/* Top Featured Movies */}
      <FeaturedMovies />

      {/* Our Photo Gallery */}
      <PhotoGallery />

      {/* Movies Coming Soon */}
      <ComingSoonMovies />


    </div>
  );
};

export default HomePage;
