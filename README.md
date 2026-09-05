# AgriGuard

AgriGuard is a mobile-first agricultural IoT dashboard with crop analysis, sensor monitoring, alerts, analytics, marketplace tools, and field workflows. The existing dashboard UI is preserved while authentication and persistence have been rebuilt for a single Vercel deployment.

## Architecture

- Frontend: React, TypeScript, Vite, Tailwind, PWA
- API: TypeScript Vercel serverless functions under `api/`
- Database: Neon PostgreSQL through Drizzle ORM
- Authentication: bcrypt password hashes and HTTP-only JWT session cookies
- Browser API calls: relative `/api/...` routes, with no `VITE_API_URL`

The database schema in `db/schema.ts` defines `users`, `iot_devices`, `sensor_readings`, and `alerts`. The initial SQL migration is in `drizzle/0000_initial_schema.sql`.

## Environment

Copy `.env.example` to `.env` for local work:

```env
DATABASE_URL=postgresql://user:password@your-neon-host.neon.tech/agriguard?sslmode=require
JWT_SECRET=replace-with-a-long-random-secret
NODE_ENV=development
DEMO_USER_PASSWORD=replace-with-a-local-only-demo-password
```

`DATABASE_URL` must be a PostgreSQL connection string from Neon. `JWT_SECRET` must be a private random string, not a URL. Never commit `.env`, database URLs, JWT secrets, or demo passwords.

## Local development

Prerequisite: Node.js 20 or newer.

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev:api
```

`npm run dev:api` starts the Vercel local runtime and serves the UI and `/api` routes from one project. Set `DEMO_USER_PASSWORD` before `npm run db:seed`; this creates `farmer@agri.com` without storing a password in source control.

Useful checks:

```bash
npm run typecheck
npm run build
```

`npm run typecheck:api` runs strict TypeScript checking for the server, schema, database, and scripts. The complete application check also validates the preserved dashboard source syntax.

## Neon database setup

1. Create a Neon project and copy its PostgreSQL connection string.
2. Put it in local `.env` as `DATABASE_URL`.
3. Run `npm run db:migrate` to create the four application tables.
4. Set `DEMO_USER_PASSWORD` and run `npm run db:seed` only when a demo account is needed.

To generate a new Drizzle migration after changing `db/schema.ts`:

```bash
npm run db:generate
npm run db:migrate
```

## Authentication API

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/verify`
- `PUT /api/auth/profile`
- `PUT /api/auth/password`

Validation, invalid credentials, network failures, and server/database failures are returned as distinct structured errors. The login screen displays an appropriate safe message for each category.

## Vercel deployment

1. Import the repository into Vercel.
2. Keep the defaults in `vercel.json`; Vite builds to `dist` and `api/**/*.ts` becomes serverless functions.
3. Add these Production and Preview environment variables in Vercel:

```text
DATABASE_URL=<Neon PostgreSQL connection string>
JWT_SECRET=<long random private secret>
NODE_ENV=production
```

4. Deploy. No Express process, separate backend, CORS setting, or frontend API URL is required.

Production cookies are `HttpOnly`, `Secure`, `SameSite=Lax`, and scoped to the application path. Secrets are read only from server environment variables.

## Project layout

```text
api/auth/[...action].ts   Vercel authentication function
db/schema.ts              Drizzle schema
drizzle/                  SQL migrations
lib/auth.ts               Cookie sessions and bcrypt helpers
lib/db.ts                 Neon Drizzle client
src/                      TypeScript React dashboard
vercel.json               Vercel build and routing configuration
```

See [AUTH_TROUBLESHOOTING.md](AUTH_TROUBLESHOOTING.md) for the original failure analysis and migration context.
