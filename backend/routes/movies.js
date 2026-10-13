const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { protect, adminOnly } = require('../middleware/auth');

// helpers ------------------------------------------------------------
const nowShowingFilter = { status: { $in: ['active', 'Now Showing'] } };
const comingSoonFilter = { status: { $in: ['upcoming', 'Coming Soon'] } };

const numericRating = (r) => {
  const n = parseFloat(r);
  return Number.isNaN(n) ? 0 : n;
};

// GET /api/movies/featured  -> top-rated now-showing movies (max 3)
router.get('/featured', async (req, res, next) => {
  try {
    const movies = await Movie.find(nowShowingFilter);
    const featured = movies
      .sort((a, b) => numericRating(b.rating) - numericRating(a.rating))
      .slice(0, 3);
    res.json(featured);
  } catch (err) {
    next(err);
  }
});

// GET /api/movies/latest -> newest now-showing movies (max 4)
router.get('/latest', async (req, res, next) => {
  try {
    const movies = await Movie.find(nowShowingFilter)
      .sort({ createdAt: -1, id: -1 })
      .limit(4);
    res.json(movies);
  } catch (err) {
    next(err);
  }
});

// GET /api/movies/coming-soon -> upcoming movies (max 4)
router.get('/coming-soon', async (req, res, next) => {
  try {
    const movies = await Movie.find(comingSoonFilter)
      .sort({ id: 1 })
      .limit(4);
    res.json(movies);
  } catch (err) {
    next(err);
  }
});

// GET /api/movies -> all movies
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.genre) filter.genre = req.query.genre;
    if (req.query.status) filter.status = req.query.status;

    const movies = await Movie.find(filter).sort({ id: 1 });
    res.json(movies);
  } catch (err) {
    next(err);
  }
});

// GET /api/movies/:id -> single movie (numeric id)
router.get('/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ id: Number(req.params.id) });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    next(err);
  }
});

// ---- admin-only writes --------------------------------------------

// POST /api/movies
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
});

// PUT /api/movies/:id
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const movie = await Movie.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/movies/:id
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const movie = await Movie.findOneAndDelete({ id: Number(req.params.id) });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie removed', id: movie.id });
  } catch (err) {
    next(err);
  }
});

// POST /api/movies/:id/trailers -> add a trailer to a movie
router.post('/:id/trailers', protect, adminOnly, async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ id: Number(req.params.id) });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    movie.trailers.push(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
