# CustomerHub — Frontend

A React + Vite + Tailwind single-page app for the Mini Customer Management App.
It talks to the Express + MongoDB backend in the sibling `../backend` project.

## Features

- **Authentication** — email + password sign-in and sign-up. A JWT is stored in
  `localStorage` and sent as `Authorization: Bearer <token>` on every request.
  All customer routes are protected; visiting one while signed out redirects to `/login`.
- **Customer list** — live search, plus **city** and **status** filters and sortable columns.
- **Pagination** — configurable page size (5 / 10 / 25 / 50) with numbered pages.
  The current page, filters and sort are mirrored in the URL, so the browser back
  button (and the details page) return you to the exact same view.
- **Customer details page** — `/customers/:id` shows a full profile with edit and delete.
- Add / edit / delete and bulk-delete customers, plus CSV import and export.

## Routes

| Path             | Description                          |
| ---------------- | ------------------------------------ |
| `/login`         | Sign in                              |
| `/register`      | Create an account                    |
| `/`              | Customer list (protected)            |
| `/customers/:id` | Customer details (protected)         |

## Run locally

**Prerequisites:** Node.js, and the backend running (see `../backend/README.md`).

1. Install dependencies:
   `npm install`
2. (Optional) Set `VITE_API_URL` in `.env.local` if the API is not on the default target.
3. Run the app:
   `npm run dev`
   The Vite dev server proxies `/api` requests to `http://localhost:3001`.

## Production

`npm run build` emits `dist/`. The backend serves that folder when it is present,
so a single `npm start` in `../backend` hosts both the API and the UI.
