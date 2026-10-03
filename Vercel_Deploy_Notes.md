# Vercel Deployment Notes — CustomerHub

Two separate Vercel projects: one for `backend`, one for `frontend`.

- Backend URL:  https://pro-with-next-vmxq.vercel.app
- Frontend URL: https://cust-mgt-sys.vercel.app

---

## 1. Backend project (Express + MongoDB)

| Setting | Value |
| --- | --- |
| Root Directory | `backend` |
| Framework Preset | Other |
| Build Command | (leave empty) |
| Output Directory | (leave empty) |
| Install Command | `npm install` |

Environment variables (Vercel → Project → Settings → Environment Variables):

| Key | Value |
| --- | --- |
| `MONGODB_URI` | your MongoDB Atlas connection string |
| `JWT_SECRET` | a long random string (`openssl rand -hex 32`) |
| `TOKEN_TTL` | `7d` |
| `ADMIN_EMAIL` | `admin@example.com` |
| `ADMIN_PASSWORD` | change this to something private |
| `FRONTEND_URL` | `https://cust-mgt-sys.vercel.app` |

`FRONTEND_URL` is the CORS allow-list. Add more origins comma-separated if you
deploy preview/staging URLs.

How it runs: `server.js` exports the Express app and skips `app.listen()` when the
`VERCEL` env var is present. `api/index.js` is the serverless entry point, and
`vercel.json` routes every request to it. Health check: `GET /api/health`.

---

## 2. Frontend project (React + Vite)

| Setting | Value |
| --- | --- |
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Environment variable:

| Key | Value |
| --- | --- |
| `VITE_API_URL` | `https://pro-with-next-vmxq.vercel.app` |

`vercel.json` adds a catch-all rewrite to `index.html` so client-side routes like
`/customers/123` work on refresh and direct links.

---

## 3. After deploying

1. Open https://cust-mgt-sys.vercel.app — sign in with the admin account
   (`ADMIN_EMAIL` / `ADMIN_PASSWORD`), or register a new user.
2. If the browser console shows a CORS error, re-check that `FRONTEND_URL` on the
   backend exactly matches the frontend origin (scheme + host, no trailing slash).
3. Because `VITE_API_URL` is baked in at build time, redeploy the frontend after
   changing it.

---

## Security notes

- `.env` files are git-ignored — do not commit them. Set the same values in the
  Vercel dashboard instead.
- The MongoDB password and `JWT_SECRET` in the original `backend/.env` are real.
  If this zip was shared with anyone, rotate the Atlas database password and
  generate a new `JWT_SECRET` before going live.
- Change the default `ADMIN_PASSWORD` before making the site public.
