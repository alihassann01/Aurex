# CivicConnect Frontend

This is the Next.js frontend for CivicConnect.

See the root [README.md](../README.md) for full local setup, environment variables, route map, and deployment instructions.

## Local Commands

```bash
npm ci
npm run dev
npm run lint
npx tsc --noEmit
npm run build
```

## Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set:

```env
NEXT_PUBLIC_API_URL=http://localhost:5004
```
