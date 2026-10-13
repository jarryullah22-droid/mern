require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();

// ---- middleware ----------------------------------------------------
// Allowed frontend origin(s). CORS_ORIGIN is the canonical name; FRONTEND_URL
// and CLIENT_URL are accepted as aliases, so any of them works.
const rawOrigins =
  process.env.CORS_ORIGIN ||
  process.env.FRONTEND_URL ||
  process.env.CLIENT_URL ||
  'http://localhost:3000';

const origins = rawOrigins
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: origins.includes('*') ? true : origins,
    credentials: true,
  })
);

// Raised limit so the frontend can send base64 image / trailer uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ---- health check --------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// ---- routes --------------------------------------------------------
app.use('/api/movies', require('./routes/movies'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/contact', require('./routes/contact'));

// Friendly index for the bare /api path
app.get('/api', (req, res) => {
  res.json({
    message: 'Movie Theater API',
    status: 'ok',
    health: '/api/health',
    endpoints: [
      'GET  /api/health',
      'GET  /api/movies',
      'GET  /api/movies/featured',
      'GET  /api/movies/latest',
      'GET  /api/movies/coming-soon',
      'GET  /api/movies/:id',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/auth/me',
      'POST /api/admin/login',
      'POST /api/bookings',
      'POST /api/contact',
    ],
  });
});

// 404 for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    hint:
      'Check the request method and path. Note: opening an API URL in a browser sends a GET request, ' +
      'so POST-only routes such as /api/auth/login return this.',
  });
});

// ---- error handler -------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate value', keyValue: err.keyValue });
  }

  // Mongoose validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// ---- start ---------------------------------------------------------
const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}

module.exports = app;
