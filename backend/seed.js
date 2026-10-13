require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Movie = require('./models/Movie');
const User = require('./models/User');

const defaultMovies = [
  {
    id: 1,
    title: 'Interstellar',
    status: 'Now Showing',
    screenings: 5,
    bookings: 0,
    genre: 'Sci-Fi',
    rating: 4.8,
    duration: '2h 49m',
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    synopsis:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    addedBy: 'Admin',
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    language: 'English',
    releaseDate: '2014-11-07',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    trailers: [
      {
        title: 'Interstellar - Official Trailer',
        url: 'https://www.youtube.com/embed/zSWdZVtXT7E',
        description: 'Official trailer for Interstellar',
        duration: '2:30',
      },
    ],
  },
  {
    id: 2,
    title: 'The Dark Knight',
    status: 'Now Showing',
    screenings: 4,
    bookings: 0,
    genre: 'Action',
    rating: 4.9,
    duration: '2h 32m',
    description:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    addedBy: 'Admin',
    trailerUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY',
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    language: 'English',
    releaseDate: '2008-07-18',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  },
  {
    id: 3,
    title: 'Avatar',
    status: 'Now Showing',
    screenings: 6,
    bookings: 0,
    genre: 'Sci-Fi',
    rating: 4.7,
    duration: '2h 42m',
    description:
      'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
    addedBy: 'Admin',
    trailerUrl: 'https://www.youtube.com/embed/5PSNL1qE6VY',
    director: 'James Cameron',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
    language: 'English',
    releaseDate: '2009-12-18',
    poster: 'https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg',
  },
  {
    id: 4,
    title: 'Inception',
    status: 'Now Showing',
    screenings: 3,
    bookings: 0,
    genre: 'Thriller',
    rating: 4.8,
    duration: '2h 28m',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    addedBy: 'Admin',
    trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    language: 'English',
    releaseDate: '2010-07-16',
    poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
  },
  {
    id: 5,
    title: 'The Avengers',
    status: 'Now Showing',
    screenings: 5,
    bookings: 0,
    genre: 'Action',
    rating: 4.6,
    duration: '2h 23m',
    description:
      "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
    addedBy: 'Admin',
    trailerUrl: 'https://www.youtube.com/embed/eOrNdBpGMv8',
    director: 'Joss Whedon',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson'],
    language: 'English',
    releaseDate: '2012-05-04',
    poster: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
  },
  {
    id: 6,
    title: 'Dune: Part Two',
    status: 'Coming Soon',
    screenings: 0,
    bookings: 0,
    genre: 'Sci-Fi',
    rating: 4.9,
    duration: '2h 46m',
    description:
      'Paul Atreides unites with the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
    addedBy: 'Admin',
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    director: 'Denis Villeneuve',
    cast: ['Timothee Chalamet', 'Zendaya', 'Rebecca Ferguson'],
    language: 'English',
    releaseDate: '2024-03-01',
    poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
  },
];

const seed = async () => {
  try {
    await connectDB();

    const fresh = process.argv.includes('--fresh');
    if (fresh) {
      await Movie.deleteMany({});
      console.log('Cleared existing movies.');
    }

    const count = await Movie.countDocuments();
    if (count === 0) {
      await Movie.insertMany(defaultMovies);
      console.log(`Inserted ${defaultMovies.length} default movies.`);
    } else {
      console.log(`Movies collection already has ${count} documents - skipping.`);
    }

    // Optionally create a first admin from env
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const exists = await User.findOne({
        email: process.env.ADMIN_EMAIL.toLowerCase(),
      });
      if (!exists) {
        await User.create({
          name: process.env.ADMIN_NAME || 'Admin',
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          isAdmin: true,
        });
        console.log(`Created admin: ${process.env.ADMIN_EMAIL}`);
      } else {
        console.log('Admin already exists - skipping.');
      }
    }

    console.log('Seed complete.');
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
