// Catch-all serverless function: /api/* -> the Express app.
// Vercel routes every request under /api to this handler, preserving the
// original URL so Express can match /api/movies, /api/auth/login, etc.
module.exports = require('../backend/serverless');
