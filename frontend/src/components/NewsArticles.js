import React from 'react';
import { Link } from 'react-router-dom';

// Enhanced news data with better images
const latestNews = [
  {
    id: 1,
    title: "New Marvel Movie Announced for 2026",
    image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "April 2, 2025",
    excerpt: "Marvel Studios has announced a new superhero movie coming in 2026, featuring one of the most anticipated character adaptations yet.",
    category: "Movie News"
  },
  {
    id: 2,
    title: "Oscar Nominations Revealed: Full List",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "March 28, 2025",
    excerpt: "The Academy has revealed this year's Oscar nominations with several surprises and historic firsts in multiple categories.",
    category: "Awards"
  },
  {
    id: 3,
    title: "Director's Cut of Popular Film Finally Released",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "March 20, 2025",
    excerpt: "Fans rejoice as the long-awaited director's cut of the popular film is set to release with over 40 minutes of new footage.",
    category: "Releases"
  }
];

const NewsArticles = () => {
  return (
    <section className="py-16 bg-dark">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">Latest News & Articles</h2>
            <div className="h-1 w-20 bg-primary mt-2"></div>
          </div>
          <Link to="/news" className="text-primary hover:text-white transition duration-300 flex items-center">
            View All 
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestNews.map(news => (
            <article key={news.id} className="group bg-secondary rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:translate-y-[-10px]">
              <Link to={`/news/${news.id}`} className="block">
                <div className="relative overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-60 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {news.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {news.date}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300 mb-3">{news.title}</h3>
                  <p className="text-gray-300 mb-4">{news.excerpt}</p>
                  <div className="flex items-center text-primary font-medium group-hover:text-white transition-colors duration-300">
                    Read More
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsArticles;
