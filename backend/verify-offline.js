/* Offline verification (no DB needed): module loading, route wiring,
   password hashing, JWT, and schema paths. */
require('dotenv').config();
process.env.JWT_SECRET = process.env.JWT_SECRET || 'offline-secret';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://placeholder';
process.env.NODE_ENV = 'test';

const assert = require('assert');

(async () => {
  let ok = 0;
  const pass = (m) => { console.log('PASS -', m); ok++; };

  // 1. load every module (catches syntax / import errors)
  const app = require('./server');
  require('./models/Movie');
  require('./models/User');
  require('./models/Booking');
  require('./models/Contact');
  require('./routes/movies');
  require('./routes/auth');
  require('./routes/admin');
  require('./routes/bookings');
  require('./routes/contact');
  require('./middleware/auth');
  pass('all modules load without errors');

  // 2. route wiring
  const routes = [];
  const walk = (stack, prefix) => {
    stack.forEach((layer) => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
        routes.push(`${methods} ${prefix}${layer.route.path}`);
      } else if (layer.name === 'router' && layer.handle.stack) {
        const seg = layer.regexp.source
          .replace('^\\/?', '/').replace('\\/?(?=\\/|$)', '')
          .replace(/\\\//g, '/').replace('^', '').replace('$', '');
        walk(layer.handle.stack, prefix + seg);
      }
    });
  };
  walk(app._router.stack, '');
  const normalize = (r) => r.replace(/\/$/, '');
  const normRoutes = routes.map(normalize);
  const flat = routes.join('\n');
  console.log('\nRegistered routes:\n' + flat + '\n');
  for (const r of [
    'GET /api/movies/featured',
    'GET /api/movies/latest',
    'GET /api/movies/coming-soon',
    'GET /api/movies',
    'GET /api/movies/:id',
    'POST /api/movies',
    'POST /api/auth/register',
    'POST /api/auth/login',
    'POST /api/admin/login',
    'POST /api/bookings',
    'POST /api/contact',
  ]) {
    assert(normRoutes.includes(normalize(r)), `missing route: ${r}`);
  }
  pass('all expected routes are registered');

  // 3. password hashing + matching
  const User = require('./models/User');
  const u = new User({ name: 'T', email: 't@t.com', password: 'secret123' });
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  u.password = await bcrypt.hash(u.password, salt);
  assert(await bcrypt.compare('secret123', u.password), 'hash compare failed');
  assert(!(await bcrypt.compare('wrong', u.password)), 'wrong password matched');
  pass('password hashing / verification works');

  // 4. JWT sign + verify
  const { signToken } = require('./middleware/auth');
  const jwt = require('jsonwebtoken');
  const token = signToken({ _id: 'abc123', isAdmin: true });
  const dec = jwt.verify(token, process.env.JWT_SECRET);
  assert(dec.id === 'abc123' && dec.isAdmin === true, 'jwt payload wrong');
  pass('JWT sign / verify works');

  // 5. movie schema paths
  const Movie = require('./models/Movie');
  const paths = Object.keys(Movie.schema.paths);
  for (const p of ['id', 'title', 'status', 'trailers', 'gallery', 'rating', 'imageUrl', 'trailerUrl']) {
    assert(paths.includes(p), `movie schema missing ${p}`);
  }
  pass('Movie schema has the fields the frontend expects');

  console.log(`\nALL ${ok} OFFLINE CHECKS PASSED`);
})().catch((e) => {
  console.error('CHECK FAILED:', e.message);
  process.exitCode = 1;
});
