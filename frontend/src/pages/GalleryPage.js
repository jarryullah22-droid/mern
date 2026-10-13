import React, { useState } from 'react';

// Gallery categories
const categories = [
  { id: 'all', name: 'All Photos' },
  { id: 'premieres', name: 'Movie Premieres' },
  { id: 'events', name: 'Special Events' },
  { id: 'behind-scenes', name: 'Behind The Scenes' },
  { id: 'theater', name: 'Our Theater' }
];

// Sample gallery images with categories
const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Movie premiere event with red carpet',
    caption: 'Annual Film Festival Opening Night',
    category: 'premieres'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Empty movie theater with red seats',
    caption: 'Our Premium Theater Experience',
    category: 'theater'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Popcorn bucket with movie tickets',
    caption: 'Movie Night Essentials',
    category: 'events'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Film production behind the scenes',
    caption: 'Behind the Scenes: Director\'s Cut',
    category: 'behind-scenes'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Movie projector in action',
    caption: 'Classic Cinema Technology',
    category: 'theater'
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Audience watching a movie',
    caption: 'Opening Night Full House',
    category: 'events'
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Vintage film camera',
    caption: 'Vintage Film Equipment Display',
    category: 'behind-scenes'
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1460881680858-30d872d5b530?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Celebrity on red carpet',
    caption: 'Celebrity Guest Appearance',
    category: 'premieres'
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Outdoor movie screening',
    caption: 'Summer Outdoor Movie Night',
    category: 'events'
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1568876694728-451bbf694b83?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Director with film crew',
    caption: 'Director Workshop Session',
    category: 'behind-scenes'
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1543536448-1e76fc2795bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'VIP movie theater seats',
    caption: 'Our VIP Screening Room',
    category: 'theater'
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1577655197620-704858b270ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Award ceremony',
    caption: 'Annual Film Awards Ceremony',
    category: 'premieres'
  }
];

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === activeCategory);

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    if (!selectedImage) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredImages.length;
    } else {
      newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    }
    
    setSelectedImage(filteredImages[newIndex]);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-black">
        <div className="absolute inset-0 opacity-30 bg-cover bg-center" 
             style={{ 
               backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80')",
               backgroundBlendMode: "overlay" 
             }}>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Photo Gallery</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore memorable moments from our theater events, premieres, and behind-the-scenes
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeCategory === category.id 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div 
                key={image.id} 
                className="overflow-hidden rounded-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                onClick={() => openLightbox(image)}
              >
                <div className="relative h-64">
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <p className="text-white font-medium">{image.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button 
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-2xl hover:text-orange-500 z-10"
              aria-label="Close lightbox"
            >
              ×
            </button>
            
            <button 
              onClick={() => navigateImage('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-orange-500 z-10"
              aria-label="Previous image"
            >
              ‹
            </button>
            
            <button 
              onClick={() => navigateImage('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-orange-500 z-10"
              aria-label="Next image"
            >
              ›
            </button>
            
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt} 
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="mt-4 text-white text-center">
              <p className="text-xl">{selectedImage.caption}</p>
              <p className="text-gray-400 mt-2">
                {categories.find(cat => cat.id === selectedImage.category)?.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
