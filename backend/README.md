# Movie Theater — Backend API

Node.js + Express + MongoDB (Mongoose) backend for the **movie-theater** React frontend.
It serves the movie data the frontend already calls, and adds real user/admin
authentication, bookings and contact messages backed by MongoDB.

API base URL: `http://localhost:4000/api` (already what `src/services/api.js` uses).

---

## 1. Install

```bash
cd backend
npm install
```

## 2. Configure environment

Copy the example file and edit it:

```bash
cp .env.example .env
```

Open `.env` and set **your own** values:

```
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/movie_theater?retryWrites=true&w=majority
JWT_SECRET=some_long_random_string
CORS_ORIGIN=http://localhost:3000
```

> **Password special characters must be URL-encoded.** If your Atlas password
> contains `@ : / ? # & %`, encode them, e.g. `@` → `%40`, `#` → `%23`.
>
> The `.env` file is listed in `.gitignore` — **never commit it.**

## 3. Seed the database (optional but recommended)

Inserts the default movies the frontend expects, and — if you set `ADMIN_EMAIL`
and `ADMIN_PASSWORD` in `.env` — creates your first admin account.

```bash
npm run seed          # adds default movies only if the collection is empty
npm run seed -- --fresh   # wipes movies first, then re-seeds
```

## 4. Run

```bash
npm run dev     # with nodemon (auto-restart)
# or
npm start
```

You should see:

```
MongoDB connected: <cluster-host>/movie_theater
Server running on http://localhost:4000
```

Quick check: open <http://localhost:4000/api/health> → `{"status":"ok",...}`

---

## API reference

### Movies (public reads)
| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/movies` | All movies (optional `?genre=` / `?status=`) |
| GET | `/api/movies/featured` | Top-rated "Now Showing" (max 3) |
| GET | `/api/movies/latest` | Newest "Now Showing" (max 4) |
| GET | `/api/movies/coming-soon` | "Coming Soon" movies (max 4) |
| GET | `/api/movies/:id` | Single movie by numeric id |

### Movies (admin only — `Authorization: Bearer <adminToken>`)
| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/movies` | Create a movie |
| PUT | `/api/movies/:id` | Update a movie |
| DELETE | `/api/movies/:id` | Delete a movie |
| POST | `/api/movies/:id/trailers` | Add a trailer to a movie |

### Auth (customers)
| Method | Path | Body |
| --- | --- | --- |
| POST | `/api/auth/register` | `{ email, password, firstName, lastName }` |
| POST | `/api/auth/login` | `{ email, password }` |
| GET | `/api/auth/me` | — (needs Bearer token) |

Both register/login return `{ token, user }`.

### Admin
| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/admin/register` | First admin is free; later ones need header `x-setup-key: <ADMIN_SETUP_KEY>` |
| POST | `/api/admin/login` | `{ email, password }` → admin token |
| GET | `/api/admin/stats` | `{ totalMovies, activeMovies, totalUsers, totalBookings, revenue }` |
| GET/POST/DELETE | `/api/admin/users` … | Manage users |
| GET | `/api/admin/bookings` | All bookings |
| GET | `/api/admin/messages` | Contact messages |

### Bookings & contact
| Method | Path | Body |
| --- | --- | --- |
| POST | `/api/bookings` | `{ movieId, movieTitle, seats[], totalAmount, ... }` |
| GET | `/api/bookings/mine` | Logged-in user's bookings (Bearer token) |
| POST | `/api/contact` | `{ name, email, subject, message }` |

---

## Project structure

```
backend/
├── server.js              # Express app + startup
├── seed.js                # Seed default movies / first admin
├── verify-offline.js      # Sanity check: loads modules, routes, hashing, JWT
├── config/db.js           # Mongoose connection
├── middleware/auth.js     # protect / adminOnly / signToken
├── models/
│   ├── Movie.js
│   ├── User.js            # users AND admins (isAdmin flag)
│   ├── Booking.js
│   └── Contact.js
└── routes/
    ├── movies.js
    ├── auth.js
    ├── admin.js
    ├── bookings.js
    └── contact.js
```

## Security notes

- Passwords are hashed with **bcrypt**; the hash is never returned by the API.
- Auth uses **JWT** (`JWT_SECRET` from `.env`).
- CORS is restricted to `CORS_ORIGIN` (default `http://localhost:3000`).
- No credentials are stored in code — everything sensitive lives in `.env`.
