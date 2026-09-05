# Authentication Failure Analysis

## Root causes

### 1. The backend is not running locally

The frontend sends authentication requests to:

```text
http://localhost:5000/api/auth/login
http://localhost:5000/api/auth/signup
```

This is configured in `.env` and is also the fallback in `src/utils/api.js`. A local health check to `http://localhost:5000/health` fails when the server is not started, so both login and registration fail before credentials are checked.

Start both applications from the repository root:

```bash
npm install
npm --prefix server install
npm --prefix server start
npm run dev
```

The backend must respond with `{ "status": "ok" }` at `http://localhost:5000/health` before using the login form.

### 2. Frontend and backend dependencies are not installed

There is no `node_modules` directory at the root or under `server`. Until the two install commands above complete, neither the Vite frontend nor the Express authentication server can run reliably.

### 3. New accounts are not persistent

`server/utils/db.js` stores users in a module-level array. Registration can appear to succeed, but all accounts disappear when the server restarts. This is especially problematic on Vercel, where serverless instances are temporary and can be replaced at any time.

The test account is recreated on every server start:

```text
Email: farmer@agri.com
Password: AgriGuard123!
```

This is not a production database and must be replaced with a persistent provider such as Postgres, MongoDB, or Supabase before relying on registration.

### 4. The current repository is not a complete Vercel deployment

The PWA plugin is configured in `vite.config.js`, but there is no `vercel.json`, no Vercel serverless API entry point, and no persistent production database adapter. Deploying only the Vite frontend leaves `/api/auth/*` unavailable. Setting `VITE_API_URL` to `http://localhost:5000` on Vercel also points to the end user's own computer, not the deployed backend.

For production, deploy the Express server separately and set:

```text
VITE_API_URL=https://your-api-domain.example.com
CORS_ORIGIN=https://your-agriguard-domain.example.com
JWT_SECRET=<long-random-secret>
NODE_ENV=production
```

Alternatively, convert the Express routes into Vercel Functions and connect them to a real hosted database.

## Request flow

1. `src/pages/Login.jsx` calls `login()` or `signup()`.
2. `src/context/AuthContext.jsx` delegates to `authApi`.
3. `src/utils/api.js` prefixes `/api/auth/login` or `/api/auth/signup` with `VITE_API_URL`.
4. `server/routes/auth.js` validates the request, hashes or compares the password, and returns a JWT.
5. The token is stored in browser storage by `tokenStorage`.

The UI catches every request error and replaces it with the generic `login.invalid_creds` message. Therefore a server-down, CORS, validation, or wrong-password error can all look like the same credential problem in the app.

## Fast diagnosis

Run these checks in order:

```bash
Invoke-RestMethod http://localhost:5000/health
```

```bash
Invoke-RestMethod http://localhost:5000/api/auth/login -Method Post -ContentType 'application/json' -Body '{"email":"farmer@agri.com","password":"AgriGuard123!"}'
```

If the first command fails, start or fix the backend. If the first succeeds but the second fails, inspect the server terminal for validation, JWT, or database errors. If both succeed but the browser fails, check `VITE_API_URL` and the backend `CORS_ORIGIN` value.

## Required production fixes

- Install and run the backend during local development.
- Replace the in-memory user store with a persistent database.
- Deploy the backend or add Vercel Functions; a static Vite deployment is not enough.
- Set `VITE_API_URL` to the deployed API URL in Vercel project environment variables.
- Set `CORS_ORIGIN` to the exact deployed frontend origin.
- Set a strong production `JWT_SECRET` and never commit `.env`.
- Return specific, safe error messages for network and server failures instead of mapping every error to invalid credentials.