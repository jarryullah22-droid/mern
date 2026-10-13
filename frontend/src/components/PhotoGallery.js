import React, { useState } from 'react';

// Sample gallery images - in a real app, these would be imported or fetched from an API
const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Movie premiere event with red carpet',
    caption: 'Annual Film Festival Opening Night'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Empty movie theater with red seats',
    caption: 'Our Premium Theater Experience'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Popcorn bucket with movie tickets',
    caption: 'Movie Night Essentials'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Film production behind the scenes',
    caption: 'Behind the Scenes: Director\'s Cut'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Movie projector in action',
    caption: 'Classic Cinema Technology'
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Audience watching a movie',
    caption: 'Opening Night Full House'
  }
];

const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Photo Gallery</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our collection of memorable moments from premieres, special events, and behind-the-scenes at our theaters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryImages.map((image) => (
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

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button 
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-2xl hover:text-orange-500 z-10"
            >
              ×
            </button>
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt} 
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="mt-4 text-white text-center">
              <p className="text-xl">{selectedImage.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PhotoGallery;
