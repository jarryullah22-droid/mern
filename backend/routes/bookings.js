const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const { protect } = require('../middleware/auth');

// Optional auth: attach req.userId if a valid token is present, else continue.
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
      req.userId = decoded.id;
    } catch (_) {
      /* ignore invalid token for public booking */
    }
  }
  next();
};

// POST /api/bookings  -> create a booking
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      movieId,
      movieTitle,
      customerName,
      email,
      phone,
      date,
      time,
      seats,
      ticketCount,
      totalAmount,
    } = req.body;

    if (movieId === undefined || movieId === null) {
      return res.status(400).json({ message: 'movieId is required' });
    }

    const booking = await Booking.create({
      user: req.userId,
      movieId: Number(movieId),
      movieTitle: movieTitle || '',
      customerName: customerName || '',
      email: email || '',
      phone: phone || '',
      date: date || '',
      time: time || '',
      seats: Array.isArray(seats) ? seats : [],
      ticketCount: Number(ticketCount) || (Array.isArray(seats) ? seats.length : 0),
      totalAmount: Number(totalAmount) || 0,
    });

    // keep the movie's booking counter in sync
    await Movie.updateOne(
      { id: Number(movieId) },
      { $inc: { bookings: booking.ticketCount || 1 } }
    );

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
});

// GET /api/bookings/mine -> the logged-in user's bookings
router.get('/mine', protect, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
