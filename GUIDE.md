# TinyLink - URL Shortener

A simple URL shortener built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma, and Neon PostgreSQL. Deployed on Vercel.

## Requirements
- Node.js 18+
- Neon PostgreSQL database

## Environment Variables
Create `.env` from `.env.example` and fill in your Neon credentials:

```
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>/<DB>?sslmode=require&channel_binding=require"
POSTGRES_HOST="<HOST>"
POSTGRES_USER="<USER>"
POSTGRES_PASSWORD="<PASSWORD>"
POSTGRES_DB="<DB>"
```

## Setup
1. Install dependencies:
   ```bash
   pnpm i # or npm i or yarn
   ```
2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
3. Apply migration to your Neon database:
   ```bash
   npx prisma migrate deploy
   ```

## Development
Run the dev server:
```bash
pnpm dev # or npm run dev or yarn dev
```
Visit http://localhost:3000

## Deploy to Vercel
1. Push this repo to GitHub.
2. Create a new Vercel project and import the repo.
3. Set the following Environment Variables in Vercel:
   - `DATABASE_URL`
   - `POSTGRES_HOST`
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DB`
4. Set build command: `next build`, output directory automatically handled.
5. Vercel will build and deploy. Prisma migrations run via `prisma migrate deploy` if you add it as a Build Step or run manually.

## API Endpoints
- POST `/api/links` – Create link. Body: `{ url: string, code?: string }` (code must match `[A-Za-z0-9]{6,8}`). Returns 409 if exists.
- GET `/api/links` – List all links.
- GET `/api/links/:code` – Get stats of a code.
- DELETE `/api/links/:code` – Delete a link.

## Routes
- `/` – Dashboard (create, list, filter, delete)
- `/code/:code` – Stats page
- `/healthz` – Health check `{ ok: true, version: "1.0" }`
- `/:code` – Redirect (302) increments clicks and updates lastClickedAt

## Notes
- Minimal Tailwind components with basic validation and error states.
- Clean, readable code with comments in API and pages where relevant.
