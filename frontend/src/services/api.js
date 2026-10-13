// Central API client for the movie-theater backend.
//
// Base URL resolution:
//   - locally: REACT_APP_API_URL from .env (default http://localhost:4000/api)
//   - in production without the var set: same-domain "/api"
//
// The value is normalised so that both "https://host" and "https://host/api"
// work — if the trailing "/api" is missing it is added automatically.
let rawBase = (
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:4000/api')
)
  .trim()
  .replace(/\/+$/, '');

// If the value is a bare host (e.g. "my-api.vercel.app") with no scheme, add
// https:// so the browser doesn't treat it as a relative path.
if (rawBase && !/^https?:\/\//i.test(rawBase) && !rawBase.startsWith('/')) {
  rawBase = `https://${rawBase}`;
}

export const API_URL = /\/api$/.test(rawBase) ? rawBase : `${rawBase}/api`;

// Handy when debugging a deployment: shows the resolved API base in the console.
// eslint-disable-next-line no-console
console.info('[api] base URL:', API_URL);

// ---- token helpers -------------------------------------------------
export const getToken = () => localStorage.getItem('token');
export const getAdminToken = () => localStorage.getItem('adminToken');

// ---- low-level request ---------------------------------------------
async function request(path, { method = 'GET', body, auth } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth === 'admin') {
    const t = getAdminToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  } else if (auth === 'user') {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const raw = await response.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch (_) {
    data = null;
  }

  if (!response.ok) {
    const message = (data && data.message) || `Request failed (${response.status})`;
    throw new Error(message);
  }

  // A successful request that isn't JSON almost always means the base URL
  // points at the static site (which returns index.html) instead of the API.
  if (raw && data === null) {
    throw new Error(
      `The API at ${API_URL} did not return JSON. Check REACT_APP_API_URL - it should point to your backend, e.g. https://<your-backend>.vercel.app/api`
    );
  }

  return data;
}

export const api = {
  get: (path, auth) => request(path, { auth }),
  post: (path, body, auth) => request(path, { method: 'POST', body, auth }),
  put: (path, body, auth) => request(path, { method: 'PUT', body, auth }),
  del: (path, auth) => request(path, { method: 'DELETE', auth }),
};

// ---- movies --------------------------------------------------------
export const fetchFeaturedMovies = () => api.get('/movies/featured');
export const fetchLatestMovies = () => api.get('/movies/latest');
export const fetchComingSoonMovies = () => api.get('/movies/coming-soon');
export const fetchAllMovies = () => api.get('/movies');
export const fetchMovieById = (id) => api.get(`/movies/${id}`);

// ---- user auth -----------------------------------------------------
export const loginUser = (email, password) =>
  api.post('/auth/login', { email, password });
export const registerUser = (payload) => api.post('/auth/register', payload);
export const fetchCurrentUser = () => api.get('/auth/me', 'user');

// ---- admin auth ----------------------------------------------------
export const adminLoginRequest = (email, password) =>
  api.post('/admin/login', { email, password });
export const adminRegisterRequest = (payload) => api.post('/admin/register', payload);

// ---- admin data ----------------------------------------------------
export const fetchAdminStats = () => api.get('/admin/stats', 'admin');
export const fetchAdminUsers = () => api.get('/admin/users', 'admin');
export const createAdminUser = (payload) => api.post('/admin/users', payload, 'admin');
export const updateAdminUser = (id, payload) => api.put(`/admin/users/${id}`, payload, 'admin');
export const deleteAdminUser = (id) => api.del(`/admin/users/${id}`, 'admin');
export const fetchAdminBookings = () => api.get('/admin/bookings', 'admin');
export const fetchAdminMessages = () => api.get('/admin/messages', 'admin');

// ---- bookings / contact -------------------------------------------
export const createBooking = (payload) => api.post('/bookings', payload, 'user');
export const fetchMyBookings = () => api.get('/bookings/mine', 'user');
export const sendContactMessage = (payload) => api.post('/contact', payload);

// ---- admin movie writes -------------------------------------------
export const createMovie = (payload) => api.post('/movies', payload, 'admin');
export const updateMovie = (id, payload) => api.put(`/movies/${id}`, payload, 'admin');
export const deleteMovie = (id) => api.del(`/movies/${id}`, 'admin');
export const addMovieTrailer = (id, trailer) =>
  api.post(`/movies/${id}/trailers`, trailer, 'admin');
