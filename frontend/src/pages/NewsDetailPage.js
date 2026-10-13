import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Import the news data (in a real app, this would come from an API)
import { allNewsArticles } from './NewsPage';

const NewsDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a small delay
    setLoading(true);
    
    setTimeout(() => {
      // Find the article with the matching ID
      const foundArticle = allNewsArticles.find(article => article.id === parseInt(id));
      
      if (foundArticle) {
        setArticle(foundArticle);
        
        // Find related articles in the same category
        const related = allNewsArticles
          .filter(item => item.category === foundArticle.category && item.id !== foundArticle.id)
          .slice(0, 3);
        
        setRelatedArticles(related);
      }
      
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="bg-dark py-16 min-h-screen">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-dark py-16 min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-gray-300 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/news" className="btn-primary px-6 py-3">
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark py-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-400">
            <Link to="/" className="hover:text-primary transition-colors duration-300">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/news" className="hover:text-primary transition-colors duration-300">News</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{article.title}</span>
          </div>
        </div>
        
        {/* Article Header */}
        <div className="mb-8">
          <div className="inline-block bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            {article.category}
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{article.title}</h1>
          <div className="flex items-center text-gray-400 text-sm">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {article.date}
          </div>
        </div>
        
        {/* Featured Image */}
        <div className="mb-10">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-auto rounded-xl shadow-lg"
          />
        </div>
        
        {/* Article Content */}
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg prose-invert">
            <p className="text-xl text-gray-300 mb-6 font-medium leading-relaxed">
              {article.excerpt}
            </p>
            
            {/* Split the content into paragraphs */}
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-300 mb-6">
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* Social Sharing */}
          <div className="mt-12 border-t border-gray-700 pt-8">
            <div className="flex flex-wrap items-center justify-between">
              <div className="mb-4 md:mb-0">
                <span className="text-gray-400 mr-4">Share this article:</span>
                <div className="inline-flex space-x-4">
                  <button className="text-gray-400 hover:text-primary transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-primary transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-primary transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-primary transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <Link to="/news" className="text-primary hover:text-white transition-colors duration-300 flex items-center">
                  <svg className="w-5 h-5 mr-2 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  Back to News
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map(news => (
                <article key={news.id} className="group bg-secondary rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:translate-y-[-10px]">
                  <Link to={`/news/${news.id}`} className="block">
                    <div className="relative overflow-hidden">
                      <img 
                        src={news.image} 
                        alt={news.title} 
                        className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
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
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors duration-300 mb-2">{news.title}</h3>
                      <div className="flex items-center text-primary font-medium group-hover:text-white transition-colors duration-300 mt-4">
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
        )}
      </div>
    </div>
  );
};

export default NewsDetailPage;
