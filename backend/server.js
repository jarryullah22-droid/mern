import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_TTL = process.env.TOKEN_TTL || '7d';

if (!MONGODB_URI) {
  console.error(
    '[server] MONGODB_URI is not set.\n' +
      '         Create a .env file (see .env.example) and add your MongoDB connection string.'
  );
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error(
    '[server] JWT_SECRET is not set.\n' +
      '         Add a long random string as JWT_SECRET in your .env file (see .env.example).'
  );
  process.exit(1);
}

/* ------------------------------------------------------------------ *
 * Database connection (serverless-safe)
 * ------------------------------------------------------------------ *
 * On Vercel the app runs as a serverless function. A cold start may
 * handle a request BEFORE the connection finishes, and the function can
 * be frozen between requests. So we:
 *   1. cache the connection promise so we only ever connect once, and
 *   2. await it before touching the DB (see the middleware below).
 * Without this, the first login/register request buffers and can fail
 * with "Operation `users.findOne()` buffering timed out after 10000ms".
 */
let dbPromise = null;

function connectDB() {
  if (!dbPromise) {
    mongoose.set('strictQuery', true);
    dbPromise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        // Keep the pool small so serverless invocations don't exhaust Atlas.
        maxPoolSize: 10,
      })
      .then(async () => {
        console.log('[server] Connected to MongoDB');
        await seedAdmin();
        return mongoose.connection;
      })
      .catch((err) => {
        // Reset so the next request can retry instead of caching a failure.
        dbPromise = null;
        console.error('[server] MongoDB connection failed:', err.message);
        throw err;
      });
  }
  return dbPromise;
}

/* ------------------------------------------------------------------ *
 * Database models
 * ------------------------------------------------------------------ */
const customerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    status: { type: String, default: 'Active' },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    versionKey: false,
    // Disable Mongoose's default `id` virtual so our own string `id` path is used.
    id: false,
  }
);

// Never leak the internal `_id` to the client — the app uses its own string `id`.
customerSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
});

const Customer = mongoose.model('Customer', customerSchema);

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'user' },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    versionKey: false,
    id: false,
  }
);

// Never expose the password hash or internal `_id`.
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);

/* ------------------------------------------------------------------ *
 * Auth helpers
 * ------------------------------------------------------------------ */
const signToken = (user) =>
  jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  });

// Express middleware: reject the request unless it carries a valid Bearer token.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    req.auth = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
  }
}

/* ------------------------------------------------------------------ *
 * App
 * ------------------------------------------------------------------ */
const app = express();
app.use(express.json({ limit: '2mb' }));

// CORS. In production set FRONTEND_URL to the deployed frontend origin(s) so only
// that site can call the API. Comma-separate several origins. If FRONTEND_URL is
// left unset, any origin is allowed (handy for local dev).
const ALLOWED_ORIGINS = (process.env.FRONTEND_URL || '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes('*')) {
    res.header('Access-Control-Allow-Origin', '*');
  } else if (requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)) {
    res.header('Access-Control-Allow-Origin', requestOrigin);
    res.header('Vary', 'Origin');
  }
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Ensure the DB is connected before any /api request touches it.
// (Health check is intentionally excluded so it can report the live state.)
app.use('/api', async (req, res, next) => {
  if (req.path === '/health') return next();
  try {
    await connectDB();
    return next();
  } catch (err) {
    return res.status(503).json({
      error: 'Database unavailable. Check MONGODB_URI and Atlas network access.',
      detail: err.message,
    });
  }
});

/* ------------------------------- Health ------------------------------ */
app.get('/api/health', async (_req, res) => {
  let db = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  let error;
  try {
    await connectDB();
    db = 'connected';
  } catch (err) {
    error = err.message;
  }
  res.json({ ok: true, db, ...(error ? { error } : {}) });
});

/* ------------------------------ Auth --------------------------------- */
// Create an account. Returns a token so the client is signed in immediately.
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    const normEmail = String(email).toLowerCase().trim();

    const existing = await User.findOne({ email: normEmail });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const user = await User.create({
      id: `user_${Date.now()}`,
      name: String(name).trim(),
      email: normEmail,
      passwordHash: await bcrypt.hash(String(password), 10),
      role: 'user',
    });

    res.status(201).json({ token: signToken(user), user: user.toJSON() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Sign in with email + password.
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

    res.json({ token: signToken(user), user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Return the currently signed-in user (used to restore a session on page load).
app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.auth.sub });
    if (!user) return res.status(401).json({ error: 'Session is no longer valid' });
    res.json(user.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* --------------------------- Customers CRUD -------------------------- */
// List all customers (newest first)
app.get('/api/customers', requireAuth, async (_req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers.map((c) => c.toJSON()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single customer by id
app.get('/api/customers/:id', requireAuth, async (req, res) => {
  try {
    const customer = await Customer.findOne({ id: req.params.id });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a customer
app.post('/api/customers', requireAuth, async (req, res) => {
  try {
    const body = req.body || {};
    const created = await Customer.create({
      id: body.id || `cust_${Date.now()}`,
      name: body.name,
      phone: body.phone,
      email: body.email,
      city: body.city,
      status: body.status || 'Active',
      createdAt: body.createdAt || new Date().toISOString(),
    });
    res.status(201).json(created.toJSON());
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a customer
app.put('/api/customers/:id', requireAuth, async (req, res) => {
  try {
    const { name, phone, email, city, status } = req.body || {};
    const updated = await Customer.findOneAndUpdate(
      { id: req.params.id },
      { $set: { name, phone, email, city, status } },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Customer not found' });
    res.json(updated.toJSON());
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a single customer
app.delete('/api/customers/:id', requireAuth, async (req, res) => {
  try {
    const result = await Customer.deleteOne({ id: req.params.id });
    if (!result.deletedCount) return res.status(404).json({ error: 'Customer not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk delete
app.post('/api/customers/bulk-delete', requireAuth, async (req, res) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    const result = await Customer.deleteMany({ id: { $in: ids } });
    res.json({ deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* --------------------- Serve the built frontend ---------------------- */
// The frontend is a separate project in ../frontend. Build it there
// (`npm run build`), and this server serves the resulting `dist` folder.
const distCandidates = [
  path.join(__dirname, '..', 'frontend', 'dist'),
  path.join(__dirname, 'dist'),
];
const distDir = distCandidates.find((dir) => fs.existsSync(dir));
if (distDir) {
  app.use(express.static(distDir));
  // SPA fallback — any non-API route returns index.html
  app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')));
} else {
  app.get('/', (_req, res) =>
    res
      .status(200)
      .send('API is running. Build the frontend (cd ../frontend && npm run build) to serve the app here.')
  );
}

/* ------------------------------ Start -------------------------------- */
// On Vercel the app runs as a serverless function, so it must not call listen().
// The handler in `api/index.js` imports this default export instead.
export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[server] Express listening on http://localhost:${PORT}`);
  });
}

// Create a default admin account on first run so there is a way to sign in.
// Called from connectDB() once the connection is established.
async function seedAdmin() {
  try {
    const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const existing = await User.findOne({ email });
    if (existing) return;
    await User.create({
      id: `user_${Date.now()}`,
      name: 'Administrator',
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: 'admin',
    });
    console.log(`[server] Seeded default admin account: ${email}`);
  } catch (err) {
    console.error('[server] Could not seed admin user:', err.message);
  }
}

// Kick off the connection at startup (fire-and-forget is fine here — the
// /api middleware awaits the same cached promise before serving requests).
if (!process.env.VERCEL) {
  connectDB().catch(() => {});
}
