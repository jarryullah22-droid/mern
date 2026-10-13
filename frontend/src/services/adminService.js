import { api } from './api';

// Admin service for fetching movie data directly from localStorage (admin panel)

// Default movie images by genre
const defaultMovieImages = {
  'Action': [
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497124401559-3e75ec2ed794?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'Comedy': [
    'https://images.unsplash.com/photo-1543584756-31dc0e74f5a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1528495612343-9ca9f4a9f67c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1543418219-44e30b057fea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'Drama': [
    'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1581822261290-991b38693d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'Horror': [
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555354921-a3fb5af6a177?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509248961158-e54f6934749c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'Sci-Fi': [
    'https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'Thriller': [
    'https://images.unsplash.com/photo-1616530940355-351fabd9524b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1604631806268-79e1e3a0a261?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'default': [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512070679279-8988d32161be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ]
};

// Default backdrop images by genre (wider format for hero sections)
const defaultBackdropImages = {
  'Action': [
    'https://images.unsplash.com/photo-1549221306-9e1a7de9e4e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1559125148-415a1dfb53c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1598899246709-c8273815f5ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
  ],
  'Comedy': [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
  ],
  'Drama': [
    'https://images.unsplash.com/photo-1532800783378-1bed60adaf58?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1493804714600-6edb1cd93080?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
  ],
  'Horror': [
    'https://images.unsplash.com/photo-1533923156502-be31530547c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1476900543704-4312b78632f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
  ],
  'Sci-Fi': [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505506874110-6a7a69069a08?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
  ],
  'Thriller': [
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504376379689-8d54347b26c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
  ],
  'default': [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
  ]
};

// Gallery images for movie details by theme
const galleryImagesByTheme = {
  // Action movie themes
  'superhero': [
    'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1535443274868-756b0f070b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'spy': [
    'https://images.unsplash.com/photo-1568277556340-f16eeab7f552?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504376379689-8d54347b26c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560264280-88b68371db39?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'war': [
    'https://images.unsplash.com/photo-1547483238-2cbf88a68efa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580130732478-4e339fb6836f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519682337058-a94d519337bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  
  // Sci-Fi themes
  'space': [
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1581822261290-991b38693d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'future': [
    'https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'robot': [
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1535378917042-10a22c95931a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  
  // Drama themes
  'family': [
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1591604466107-ec97de577aff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'romance': [
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1537261131936-3cdff36a1ac9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'historical': [
    'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1563804447971-6e113ab80713?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552083375-1447ce886485?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1577083552431-6e5fd01aa1b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ]
};

// Generic gallery images for any movie
const genericGalleryImages = [
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1559125148-415a1dfb53c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1594908900066-3f47337549d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1585951237313-1979e4df7385?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
];

// Movie title keywords to themes mapping
const movieKeywordsToThemes = {
  // Action keywords
  'avenger': 'superhero',
  'hero': 'superhero',
  'marvel': 'superhero',
  'batman': 'superhero',
  'superman': 'superhero',
  'wonder': 'superhero',
  'captain': 'superhero',
  'mission': 'spy',
  'spy': 'spy',
  'agent': 'spy',
  'bond': 'spy',
  'bourne': 'spy',
  'war': 'war',
  'soldier': 'war',
  'battle': 'war',
  'army': 'war',
  
  // Sci-Fi keywords
  'star': 'space',
  'space': 'space',
  'galaxy': 'space',
  'planet': 'space',
  'alien': 'space',
  'future': 'future',
  'cyber': 'future',
  'tech': 'future',
  'robot': 'robot',
  'android': 'robot',
  'machine': 'robot',
  'ai': 'robot',
  
  // Drama keywords
  'family': 'family',
  'father': 'family',
  'mother': 'family',
  'son': 'family',
  'daughter': 'family',
  'love': 'romance',
  'romance': 'romance',
  'wedding': 'romance',
  'relationship': 'romance',
  'history': 'historical',
  'king': 'historical',
  'queen': 'historical',
  'century': 'historical',
  'ancient': 'historical'
};

// Title-specific movie poster images
const titleSpecificPosters = {
  'interstellar': [
    'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1543722530-d2c3201371e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'inception': [
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500417148159-68083bd7333a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504333638930-c8787321eee0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'avatar': [
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'avengers': [
    'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1535443274868-756b0f070b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'titanic': [
    'https://images.unsplash.com/photo-1582779898239-cdc53c2a6e08?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551781066-15814a3496e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'star wars': [
    'https://images.unsplash.com/photo-1472457897821-70d3819a0e24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1546561892-65bf811416b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'jurassic': [
    'https://images.unsplash.com/photo-1569053956329-bf9f6d5afa84?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1569053956329-bf9f6d5afa84?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1569053956329-bf9f6d5afa84?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'matrix': [
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'lord of the rings': [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'harry potter': [
    'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1535666669445-e8c15cd2e7d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1479740030693-66ad10f3a7b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ]
};

// Title-specific movie backdrop images
const titleSpecificBackdrops = {
  'interstellar': [
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
  ],
  'inception': [
    'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1520034475321-cbe63696469a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
  ],
  'avatar': [
    'https://images.unsplash.com/photo-1518050947974-4be8c7469f0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
  ],
  'avengers': [
    'https://images.unsplash.com/photo-1556707752-481d500a2c58?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
  ]
};

// Helper function to get title-specific image
const getTitleSpecificImage = (movie, imageType = 'poster') => {
  if (!movie.title) return null;
  
  const title = movie.title.toLowerCase();
  const collection = imageType === 'poster' ? titleSpecificPosters : titleSpecificBackdrops;
  
  // Check if any part of the title matches our specific image collections
  for (const [keyword, images] of Object.entries(collection)) {
    if (title.includes(keyword)) {
      // Return a random image from the collection
      return images[Math.floor(Math.random() * images.length)];
    }
  }
  
  return null;
};

// Helper function to determine movie theme based on title
const getMovieTheme = (movie) => {
  if (!movie.title) return null;
  
  const title = movie.title.toLowerCase();
  
  // Check if any keywords in the title match our theme mapping
  for (const [keyword, theme] of Object.entries(movieKeywordsToThemes)) {
    if (title.includes(keyword)) {
      return theme;
    }
  }
  
  // If no specific theme found, return null to use genre-based images
  return null;
};

// Helper function to add images to movies if they don't have one
const addImagesToMovies = (movies) => {
  return movies.map((movie, index) => {
    let updatedMovie = { ...movie };
    
    // Try to determine a specific theme for this movie
    const movieTheme = getMovieTheme(updatedMovie);
    
    // Add poster image if not present
    if (!updatedMovie.poster || updatedMovie.poster === '') {
      // First try to get a title-specific poster
      const titleSpecificPoster = getTitleSpecificImage(updatedMovie, 'poster');
      if (titleSpecificPoster) {
        updatedMovie.poster = titleSpecificPoster;
      } else {
        // Fall back to genre-based poster
        const genreImages = defaultMovieImages[updatedMovie.genre] || defaultMovieImages['default'];
        const imageIndex = index % genreImages.length;
        updatedMovie.poster = genreImages[imageIndex];
      }
    }
    
    // Add backdrop image if not present
    if (!updatedMovie.backdrop || updatedMovie.backdrop === '') {
      // First try to get a title-specific backdrop
      const titleSpecificBackdrop = getTitleSpecificImage(updatedMovie, 'backdrop');
      if (titleSpecificBackdrop) {
        updatedMovie.backdrop = titleSpecificBackdrop;
      } else {
        // Fall back to genre-based backdrop
        const backdropImages = defaultBackdropImages[updatedMovie.genre] || defaultBackdropImages['default'];
        const backdropIndex = index % backdropImages.length;
        updatedMovie.backdrop = backdropImages[backdropIndex];
      }
    }
    
    // Add gallery images if not present
    if (!updatedMovie.gallery || !Array.isArray(updatedMovie.gallery) || updatedMovie.gallery.length === 0) {
      // If we have a specific theme for this movie, use those images
      if (movieTheme && galleryImagesByTheme[movieTheme]) {
        updatedMovie.gallery = [...galleryImagesByTheme[movieTheme]];
      } else {
        // Otherwise use generic gallery images
        const shuffledGallery = [...genericGalleryImages].sort(() => 0.5 - Math.random());
        updatedMovie.gallery = shuffledGallery.slice(0, 4); // Take 4 random gallery images
      }
    }
    
    // Add related images for the movie detail page
    if (!updatedMovie.relatedImages || !Array.isArray(updatedMovie.relatedImages) || updatedMovie.relatedImages.length === 0) {
      // Combine images from theme and genre for more variety
      let relatedImagePool = [];
      
      // Add theme-specific images if available
      if (movieTheme && galleryImagesByTheme[movieTheme]) {
        relatedImagePool = [...relatedImagePool, ...galleryImagesByTheme[movieTheme]];
      }
      
      // Add genre-specific images
      if (updatedMovie.genre && defaultMovieImages[updatedMovie.genre]) {
        relatedImagePool = [...relatedImagePool, ...defaultMovieImages[updatedMovie.genre]];
      }
      
      // Add some generic images if we don't have enough
      if (relatedImagePool.length < 6) {
        relatedImagePool = [...relatedImagePool, ...genericGalleryImages];
      }
      
      // Shuffle and take 6 unique images
      const shuffledRelated = [...new Set(relatedImagePool)].sort(() => 0.5 - Math.random());
      updatedMovie.relatedImages = shuffledRelated.slice(0, 6);
    }
    
    return updatedMovie;
  });
};

// ---- API-backed data functions -------------------------------------
// These now talk to the Node/Express/MongoDB backend instead of localStorage.

export const fetchFeaturedMoviesFromAdmin = async () => {
  const movies = await api.get('/movies/featured');
  return addImagesToMovies(movies || []);
};

export const fetchLatestMoviesFromAdmin = async () => {
  const movies = await api.get('/movies/latest');
  return addImagesToMovies(movies || []);
};

export const fetchComingSoonMoviesFromAdmin = async () => {
  const movies = await api.get('/movies/coming-soon');
  return addImagesToMovies(movies || []);
};

export const fetchAllMoviesFromAdmin = async () => {
  const movies = await api.get('/movies');
  return addImagesToMovies(movies || []);
};

export const updateMovieInAdmin = async (movieId, updates) => {
  try {
    return await api.put(`/movies/${movieId}`, updates, 'admin');
  } catch (error) {
    console.error(`Error updating movie with ID ${movieId}:`, error);
    return false;
  }
};

export const addTrailerToMovie = async (movieId, trailer) => {
  try {
    return await api.post(`/movies/${movieId}/trailers`, trailer, 'admin');
  } catch (error) {
    console.error(`Error adding trailer to movie with ID ${movieId}:`, error);
    return false;
  }
};

// Export the addImagesToMovies function so it can be imported elsewhere
export { addImagesToMovies };

// Fetch a single movie by ID from the backend
export const fetchMovieByIdFromAdmin = async (id) => {
  try {
    const movie = await api.get(`/movies/${id}`);
    if (!movie) return null;

    const [enriched] = addImagesToMovies([movie]);

    if (enriched.imageUrl) {
      enriched.poster = enriched.poster || enriched.imageUrl;
      enriched.backdrop = enriched.backdrop || enriched.imageUrl;
    }

    return enriched;
  } catch (error) {
    console.error(`Error fetching movie with ID ${id} from backend:`, error);
    return null;
  }
};
