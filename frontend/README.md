# Movie Theater Website

A modern, responsive movie theater website built with React.js and Tailwind CSS. This website allows users to browse movies, view movie details, book tickets, and more.

## Features

- Responsive design that works on all devices
- Movie browsing with filtering and sorting options
- Movie details page with synopsis, cast, and trailer
- Ticket booking system with seat selection
- User authentication (login/register)
- About and Contact pages
- Modern UI with Tailwind CSS

## Screenshots

The design is based on the provided mockups for:
- Home page
- Movies page
- Movie detail page
- Login/Register pages
- About page
- Contact page
- Ticket booking page

## Project layout

This project has two parts, both in this repository:

- The React frontend (this folder).
- `backend/` — a Node.js + Express + MongoDB API that the frontend talks to.

The frontend reads the API base URL from `REACT_APP_API_URL` in `.env`
(default: `http://localhost:4000/api`).

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16.0.0 or later)
- npm (v8.0.0 or later)
- A MongoDB database (e.g. a free MongoDB Atlas cluster)

## 1. Start the backend

```bash
cd backend
cp .env.example .env      # then edit .env and add your MongoDB URI + JWT secret
npm install
npm run seed              # loads default movies (and a first admin, if configured)
npm start                 # runs on http://localhost:4000
```

See `backend/README.md` for the full API reference and environment options.

## 2. Start the frontend

1. From the project root, install the dependencies:

```bash
npm install
```

## Running the Development Server

To start the development server, run:

```bash
npm start
```

This will start the application on [http://localhost:3000](http://localhost:3000).

## Building for Production

To create a production build, run:

```bash
npm run build
```

This will create an optimized build in the `build` folder.

## Deploy to Vercel (serverless)

This repo is ready to deploy as a single Vercel project: the React app is
served as static files and the Express API runs as a serverless function
under `/api` (see the `api/` folder and `vercel.json`). The MongoDB
connection is cached between invocations in `backend/config/db.js`.

### Steps

1. Push this repository to GitHub.
2. On Vercel: **Add New → Project**, import the repo.
   - Framework preset: **Create React App** (auto-detected)
   - Build command: `CI=false npm run build` (already set in `vercel.json`)
   - Output directory: `build`
   - Root directory: leave as the repo root
3. Add these **Environment Variables** (Project Settings → Environment Variables):

   | Name | Value |
   | --- | --- |
   | `MONGODB_URI` | your MongoDB Atlas connection string |
   | `JWT_SECRET` | a long random string |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CORS_ORIGIN` | `https://<your-app>.vercel.app` |
   | `REACT_APP_API_URL` | `/api` |

   `REACT_APP_API_URL=/api` makes the frontend call the serverless API on the
   same domain, so there are no CORS issues. It is baked in at build time.

4. Deploy. Your API is then live at `https://<your-app>.vercel.app/api/...`
   (e.g. `/api/health`, `/api/movies`).

### Using two separate Vercel projects (frontend + API)

You can also deploy the API and the frontend as **two** Vercel projects, e.g.
API at `https://your-api.vercel.app` and frontend at `https://your-app.vercel.app`.
Two things matter here:

1. **Frontend** → set the build-time env var
   `REACT_APP_API_URL=https://your-api.vercel.app/api` — the `/api` suffix is
   required — then **redeploy** (the value is baked in at build time).
2. **Backend** → set `CORS_ORIGIN=https://your-app.vercel.app` so the browser is
   allowed to call the API from the other domain (otherwise you get a CORS
   error). Use a comma-separated list for several origins, or `*` to allow all
   while testing.

On the API domain, opening the root (`/`) shows `Cannot GET /` — that is normal;
the API lives under `/api/...` (try `/api/health`).

### Seeding the database

Serverless functions can't run one-off scripts, so run the seed **from your
machine** against the same database the backend uses on Vercel.

macOS / Linux:

```bash
cd backend
MONGODB_URI="<same connection string>" node seed.js
```

Windows: put `MONGODB_URI=...` in `backend\.env`, then double-click
`backend\seed-database.bat` (or run `npm run seed`).

After seeding, check it worked by opening
`https://<your-backend>.vercel.app/api/movies` in a browser — it should return
a JSON array of movies (not `[]`).

### Notes

- `CI=false` is set in the build command so existing ESLint warnings don't
  fail the production build on Vercel.
- **Request body limit:** Vercel caps request bodies at ~4.5 MB. The admin
  image/trailer uploads send base64 data, so very large files may fail — keep
  uploads small or move to an upload service (e.g. Cloudinary).
- **Cold starts:** the first request after idle takes a moment while the
  function boots and reconnects to MongoDB.

## Project Structure

```
movie-website/
├── api/                # Vercel serverless entry (wraps the Express app)
├── backend/            # Node.js + Express + MongoDB API
├── public/             # Public assets
├── src/                # Source files
│   ├── components/     # Reusable components
│   ├── context/        # Auth contexts
│   ├── pages/          # Page components
│   ├── services/       # api.js (API client) + adminService.js
│   ├── App.js          # Main App component
│   └── index.js        # Entry point
├── vercel.json         # Vercel build + function config
├── package.json        # Dependencies and scripts
└── tailwind.config.js  # Tailwind CSS configuration
```

## Technologies Used

- React.js - Frontend library
- React Router - Navigation
- Tailwind CSS - Styling
- PostCSS - CSS processing

## Future Enhancements

- Integration with a backend API for real data
- User profiles and saved preferences
- Online payment processing
- Movie ratings and reviews
- Admin dashboard for content management

## License

This project is licensed under the MIT License - see the LICENSE file for details.
