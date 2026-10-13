import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-black">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Us</h1>
            <div className="flex items-center justify-center text-sm text-gray-300">
              <Link to="/" className="hover:text-orange-500">Home</Link>
              <span className="mx-2">›</span>
              <span>About Us</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dotted Line Separator */}
      <div className="border-b border-dotted border-gray-600"></div>

      {/* Proving the Best Film Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="max-w-2xl text-center">
              <div className="text-sm text-orange-500 mb-2 text-center">Get To Know</div>
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Proving the Best Film Services</h2>
              
              <p className="text-gray-300 mb-6 text-center">
                Based in Faisalabad, our cinema brings the latest Hollywood, Bollywood and Pakistani
                releases to the big screen with sharp digital projection and immersive surround sound.
                Whether it's a family outing, a first date or a weekend blockbuster, every screening is
                built around one thing — giving you a great night at the movies.
              </p>
              
              {/* Years of Innovation */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2 text-center">7 Years of Innovation</h3>
                <p className="text-gray-300 text-center">
                  Over the years we've kept raising the bar — upgraded screens and sound, comfortable
                  seating, fresh concessions and a simple online booking system that lets you choose your
                  exact showtime and seats in seconds. Reserve online, pay when you collect your tickets
                  at the counter, and skip the queue on the way in.
                </p>
              </div>
              
              {/* Discover More button removed */}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="py-8 flex justify-center">
        <div className="w-16 border-t-2 border-orange-500"></div>
      </div>

    </div>
  );
};

export default AboutPage;
