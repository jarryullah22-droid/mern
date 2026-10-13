const connectDB = require('./config/db');
const app = require('./server');

/**
 * Vercel serverless entry point.
 *
 * Ensures a (cached) MongoDB connection exists, then hands the request to
 * the Express app. `server.js` only calls app.listen() when it is run
 * directly, so importing it here does not start a long-running server.
 */
module.exports = async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        message: 'Database connection failed',
        error: err.message,
      })
    );
    return;
  }

  return app(req, res);
};
