<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/65739f78-36d5-4b9e-bb97-9a9d52e27c8b

## Run Locally

**Prerequisites:** Node.js and a MongoDB database (e.g. MongoDB Atlas).

1. Install dependencies:
   `npm install`
2. Create your env file and fill it in:
   `cp .env.example .env`
   - `MONGODB_URI` — your MongoDB connection string (Atlas: Connect → Drivers)
   - `PORT` — port for the Express server (defaults to 3001)
   - `JWT_SECRET` — a long random string used to sign login tokens (**required**)
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — a default admin account seeded on first run
3. Start the API server:
   `npm run server`

The UI lives in the sibling `../frontend` project. Run its dev server there
(`npm run dev`); its Vite proxy forwards `/api` requests here automatically.

## Run in production (single server)

1. Build the frontend: `cd ../frontend && npm install && npm run build`
2. Start the server: `npm start`
   Express then serves the API and the built frontend (`../frontend/dist`) on `PORT`.

## Authentication

Every `/api/customers*` route requires a Bearer token. Sign in (or register) through
the `/api/auth/*` routes; the frontend stores the returned token and sends it as
`Authorization: Bearer <token>` on each request.

On first run the server seeds an admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD`
(defaults: `admin@example.com` / `admin123`). Change these before deploying.

## API endpoints

Auth:
- `POST   /api/auth/register`         — create an account → `{ token, user }`
- `POST   /api/auth/login`            — sign in → `{ token, user }`
- `GET    /api/auth/me`               — current user (requires a token)

Customers (all require a token):
- `GET    /api/customers`             — list customers
- `GET    /api/customers/:id`         — get one customer
- `POST   /api/customers`             — create a customer
- `PUT    /api/customers/:id`         — update a customer
- `DELETE /api/customers/:id`         — delete a customer
- `POST   /api/customers/bulk-delete` — delete several customers at once
- `GET    /api/health`                — server + database status

> In MongoDB Atlas, add the IP address your server runs from under
> **Network Access → IP Access List**, or the connection will be refused.
