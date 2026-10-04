# CustomerHub — Customer Management App (MERN)

A full-stack customer management application: add, view, edit, delete, search and
import/export customer records, with JWT authentication and persistent storage.

- **backend/** — Node.js + Express REST API with MongoDB (Mongoose) and JWT auth.
- **frontend/** — React + Vite + Tailwind single-page app.

## Live URLs

- Frontend: https://mern-qfdv.vercel.app
- Backend API: https://mern-kappa-liart.vercel.app

## Structure

```
.
├── backend/    Express API (deployed to Vercel as a serverless function)
└── frontend/   React + Vite SPA (deployed to Vercel as a static site)
```

## Local development

### Backend

```
cd backend
npm install
cp .env.example .env      # then fill in the values
npm run server            # http://localhost:3001
```

### Frontend

```
cd frontend
npm install
npm run dev               # http://localhost:3000 (proxies /api to :3001)
```

## Environment variables

**backend/.env**

| Key | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | long random string used to sign tokens |
| `TOKEN_TTL` | token lifetime (e.g. `7d`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | default admin seeded on first run |
| `FRONTEND_URL` | allowed CORS origin(s), comma-separated |

**frontend/.env**

| Key | Description |
| --- | --- |
| `VITE_API_URL` | base URL of the backend API |

## Deployment

Both folders deploy as separate Vercel projects. See `Vercel_Deploy_Notes.md`
for the full setup (root directory, build settings and env vars).

## Notes

- The Express API opens its MongoDB connection lazily and awaits it before
  handling any `/api` request, so it works correctly as a Vercel serverless
  function (cold starts included).
- Atlas **Network Access** must allow `0.0.0.0/0` (or Vercel's IPs), otherwise
  serverless functions cannot reach the database.
