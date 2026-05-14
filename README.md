# CivicConnect

CivicConnect is a full-stack smart city services portal for residents, staff, department administrators, and super admins.

The app includes:

- Resident civic request submission and tracking
- Staff request queues with status updates and internal notes
- Permit applications, review queues, fee receipts, and certificates
- City announcements, emergency broadcasts, and event registration
- Analytics dashboards for department and city leadership
- Role-aware navigation and protected frontend routes

## Tech Stack

Frontend:

- Next.js 16 App Router
- React 18
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand
- Radix UI primitives
- Recharts

Backend:

- Node.js
- Express 5
- MongoDB with Mongoose
- JWT authentication
- bcrypt password hashing
- Token blacklist logout support

## Project Structure

```txt
.
├── backend/      # Express API
├── frontend/     # Next.js app
└── README.md
```

## Local Setup

Install dependencies:

```bash
cd backend
npm ci

cd ../frontend
npm ci
```

Create local env files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open:

```txt
http://localhost:3000
```

Backend health check:

```txt
http://localhost:5004/api/health
```

## Environment Variables

Backend `backend/.env`:

```env
PORT=5004
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/aurex
JWT_SECRET_KEY=replace-with-a-secure-random-secret
FRONTEND_URL=http://localhost:3000
# CORS_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
```

Frontend `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5004
```

For production, set `NEXT_PUBLIC_API_URL` to the deployed backend origin, for example:

```env
NEXT_PUBLIC_API_URL=https://your-api.onrender.com
```

## Scripts

Backend:

```bash
npm run dev      # nodemon development server
npm start        # production server
```

Frontend:

```bash
npm run dev      # development server
npm run build    # production build
npm start        # run production build
npm run lint     # ESLint
```

## API Overview

Public:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`

Authenticated:

- `GET /api/auth/profile`
- `POST /api/auth/logout`
- `GET /api/requests`
- `POST /api/requests`
- `PATCH /api/requests/:id`
- `GET /api/permits`
- `POST /api/permits`
- `PATCH /api/permits/:id`
- `GET /api/announcements`
- `POST /api/announcements`
- `PATCH /api/announcements/:id/read`
- `GET /api/events`
- `POST /api/events/:id/register`
- `GET /api/analytics/overview`

## Frontend Route Map

Public:

- `/`
- `/login`
- `/register`

Resident:

- `/resident`
- `/resident/requests`
- `/resident/permits`
- `/resident/announcements`

Staff:

- `/staff`
- `/staff/requests`
- `/staff/permits`
- `/staff/announcements`

Department Admin:

- `/dept-admin`
- `/dept-admin/requests`
- `/dept-admin/permits`
- `/dept-admin/announcements`
- `/dept-admin/analytics`
- `/dept-admin/staff-mgmt`

Super Admin:

- `/super-admin`
- `/super-admin/requests`
- `/super-admin/permits`
- `/super-admin/announcements`
- `/super-admin/analytics`
- `/super-admin/staff-mgmt`

## Deployment

The frontend and backend are designed to deploy as separate services.

### Backend

Deploy `backend/` to any Node hosting provider.

Build command:

```bash
npm ci
```

Start command:

```bash
npm start
```

Set environment variables:

- `NODE_ENV=production`
- `PORT` if your host does not inject it automatically
- `MONGO_URI`
- `JWT_SECRET_KEY`
- `FRONTEND_URL` or `CORS_ORIGINS`

Use MongoDB Atlas or another managed MongoDB instance for production.

### Frontend

Deploy `frontend/` to a Next.js host such as Vercel.

Build command:

```bash
npm run build
```

Output:

```txt
.next
```

Set environment variables:

- `NEXT_PUBLIC_API_URL=https://your-backend-domain`

The frontend rewrites `/api/*` requests to `NEXT_PUBLIC_API_URL/api/*`, so the browser can keep using same-origin `/api` paths.

## Verification Checklist

Before deploying:

```bash
cd frontend
npm run lint
npx tsc --noEmit
npm run build

cd ../backend
node --check index.js
node --check routes/platform.routes.js
node --check controllers/platform.controllers.js
```

After deploying:

- Visit the frontend landing page
- Register a user for each role
- Confirm each role lands on the correct dashboard
- Confirm `/api/health` returns `200`
- Confirm `NEXT_PUBLIC_API_URL` points to the backend origin
- Confirm backend `CORS_ORIGINS` includes the deployed frontend origin

## Data Persistence Note

Authentication users and token blacklisting use MongoDB.

The current non-auth module APIs for requests, permits, announcements, events, and analytics use seeded in-memory data so the full product demo works immediately. For a production launch, replace those seeded stores in `backend/controllers/platform.controllers.js` with MongoDB models and persistence.
