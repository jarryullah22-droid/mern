// Vercel serverless entry point for the backend.
// Vercel routes every request to this function (see vercel.json) and the
// Express app from server.js handles it. server.js skips app.listen() when
// the VERCEL env var is present, so importing it here is safe.
import app from '../server.js';

export default app;
