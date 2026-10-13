import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Enhanced news data with more articles and better images
export const allNewsArticles = [
  {
    id: 1,
    title: "New Marvel Movie Announced for 2026",
    image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "April 2, 2025",
    excerpt: "Marvel Studios has announced a new superhero movie coming in 2026, featuring one of the most anticipated character adaptations yet.",
    category: "Movie News",
    content: "Marvel Studios President Kevin Feige announced today at a press conference that the studio has greenlit a new superhero movie slated for release in summer 2026. The film will introduce a fan-favorite character from the comics who has yet to appear in the MCU. While details are being kept under wraps, sources close to the production suggest that the film will tie into the larger multiverse storyline that has been developing across recent Marvel projects. Casting is expected to begin later this year, with production scheduled to start in early 2026."
  },
  {
    id: 2,
    title: "Oscar Nominations Revealed: Full List",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "March 28, 2025",
    excerpt: "The Academy has revealed this year's Oscar nominations with several surprises and historic firsts in multiple categories.",
    category: "Awards",
    content: "The Academy of Motion Picture Arts and Sciences announced the nominations for the 98th Academy Awards this morning, with several films dominating the major categories. Leading the pack is the historical drama 'The Last Light' with 12 nominations, followed closely by the sci-fi epic 'Beyond the Stars' with 10 nominations. In a historic first, three women have been nominated in the Best Director category. The ceremony will be held on April 27th at the Dolby Theatre in Hollywood, with the internationally acclaimed director Christopher Nolan serving as the host for the evening."
  },
  {
    id: 3,
    title: "Director's Cut of Popular Film Finally Released",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "March 20, 2025",
    excerpt: "Fans rejoice as the long-awaited director's cut of the popular film is set to release with over 40 minutes of new footage.",
    category: "Releases",
    content: "After years of fan campaigns and speculation, the studio has finally announced the release of the director's cut for the critically acclaimed film 'Eternal Shadows'. The new version includes over 40 minutes of previously unseen footage and several alternate scenes that were cut from the theatrical release. Director James Cameron stated that this version represents his complete vision for the film without the constraints of runtime limitations. The director's cut will be available on streaming platforms starting next month and will also receive a limited theatrical release in select IMAX theaters nationwide."
  },
  {
    id: 4,
    title: "Major Studio Announces New Film Franchise",
    image: "https://images.unsplash.com/photo-1536440136628-c69b3fa7fbe0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "March 15, 2025",
    excerpt: "Universal Pictures has announced a new film franchise based on a popular video game series, with a star-studded cast.",
    category: "Movie News",
    content: "Universal Pictures has officially announced the development of a new film franchise based on the bestselling video game series 'Night Hunters'. The studio has signed a multi-picture deal that will span at least three films, with an option for additional spin-offs. Academy Award-winning actress Emma Stone has been cast in the lead role, with supporting roles filled by Michael B. Jordan and Timothée Chalamet. The first film is scheduled to begin production this summer with a targeted release date of summer 2026. The project will be directed by Denis Villeneuve, known for his work on 'Dune' and 'Blade Runner 2049'."
  },
  {
    id: 5,
    title: "Beloved Actor Returns to Iconic Role After 15 Years",
    image: "https://images.unsplash.com/photo-1512070679279-8988d32161be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "March 10, 2025",
    excerpt: "Fans are thrilled as a beloved actor announces their return to an iconic character role after a 15-year hiatus.",
    category: "Casting News",
    content: "In a surprise announcement that has sent waves through the entertainment industry, acclaimed actor Robert Downey Jr. has confirmed that he will be returning to his iconic role in a new sequel after a 15-year hiatus. The actor, who previously stated he had retired from the character, explained that a compelling script and the return of the original director convinced him to reprise the role. The sequel is expected to address the events that have transpired in the fictional universe during the character's absence and will introduce several new characters to potentially carry the franchise forward."
  },
  {
    id: 6,
    title: "International Film Festival Announces Lineup",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "March 5, 2025",
    excerpt: "The prestigious Cannes Film Festival has announced its official selection for this year's competition.",
    category: "Festivals",
    content: "The Cannes Film Festival has unveiled its official selection for the 2025 edition, featuring 21 films competing for the coveted Palme d'Or. The lineup includes new works from previous winners as well as first-time directors from around the world. Notable entries include the latest film from Japanese director Hirokazu Kore-eda, a surprise comeback film from American director Quentin Tarantino, and the English-language debut of acclaimed Korean director Bong Joon-ho. The festival will run from May 13 to May 24, with the jury headed by acclaimed French actress Léa Seydoux."
  },
  {
    id: 7,
    title: "Streaming Service Announces Massive Investment in Original Films",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "February 28, 2025",
    excerpt: "A major streaming platform has announced a $5 billion investment in original film content over the next three years.",
    category: "Industry News",
    content: "In a bold move that signals the continuing shift in the entertainment landscape, a leading streaming service has announced a $5 billion investment in original film content over the next three years. The company plans to produce or acquire over 50 feature films annually, ranging from indie productions to big-budget blockbusters. This announcement comes as traditional studios are increasingly developing their own streaming platforms, intensifying competition in the digital space. The streaming service has also revealed plans to build new production facilities in Atlanta and London to support this expanded content creation initiative."
  },
  {
    id: 8,
    title: "Classic Cinema Chain Announces Major Theater Renovations",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "February 20, 2025",
    excerpt: "A nationwide cinema chain is investing $200 million to upgrade theaters with cutting-edge technology and luxury amenities.",
    category: "Theater News",
    content: "One of the nation's largest cinema chains has announced a comprehensive $200 million renovation plan that will transform the moviegoing experience across all its locations. The upgrades include state-of-the-art laser projection systems, immersive Dolby Atmos sound, luxury recliner seating, and expanded food and beverage options including full-service bars. The company is also introducing a new premium format called 'Ultra Screen' that will feature screens up to 70 feet wide and advanced HDR capabilities. The renovations are expected to be completed within 18 months, with the first upgraded theaters opening to the public next month."
  }
];

const NewsPage = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Movie News', 'Awards', 'Releases', 'Casting News', 'Festivals', 'Industry News', 'Theater News'];
  
  // Filter articles based on selected category
  const filteredArticles = filter === 'All' 
    ? allNewsArticles 
    : allNewsArticles.filter(article => article.category === filter);

  return (
    <div className="bg-dark py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Latest News & Articles</h1>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest news, announcements, and stories from the world of cinema.
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center mb-10 gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                filter === category 
                  ? 'bg-primary text-white' 
                  : 'bg-secondary text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Featured Article */}
        {filteredArticles.length > 0 && (
          <div className="mb-12">
            <Link to={`/news/${filteredArticles[0].id}`} className="block group">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-secondary rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="relative overflow-hidden h-80 lg:h-auto">
                  <img 
                    src={filteredArticles[0].image} 
                    alt={filteredArticles[0].title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {filteredArticles[0].category}
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {filteredArticles[0].date}
                  </div>
                  <h2 className="text-3xl font-bold text-white group-hover:text-primary transition-colors duration-300 mb-4">
                    {filteredArticles[0].title}
                  </h2>
                  <p className="text-gray-300 mb-6">
                    {filteredArticles[0].excerpt}
                  </p>
                  <div className="flex items-center text-primary font-medium group-hover:text-white transition-colors duration-300">
                    Read Full Article
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
        
        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.slice(1).map(news => (
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
        
        {/* Newsletter Subscription */}
        <div className="mt-16 bg-secondary rounded-xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Subscribe to Our Newsletter</h3>
              <p className="text-gray-300 mb-6">
                Get the latest news, exclusive offers, and updates on new releases delivered directly to your inbox.
              </p>
            </div>
            <div>
              <form className="space-y-4">
                <div>
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full btn-primary py-3"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
