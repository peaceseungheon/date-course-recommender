# quickstart.md

This quickstart explains how to run the MVP locally (TypeScript + Nuxt 3 + Vite)

Requirements

- Node.js 18+ (LTS)
- pnpm (recommended) or npm

Install

```bash
pnpm install
```

Run dev server

```bash
pnpm dev
# or
npm run dev
```

What to expect

- Nuxt dev server will start (Vite under the hood)
- Local API endpoints exposed under `/api/*` (implemented as Nuxt server routes)

Testing

- Run unit tests (Vitest): `pnpm test`
- Run E2E (Playwright): `pnpm test:e2e`

Configuration

- Add API keys (KAKAO_API_KEY, NEWSAPI_KEY) to `.env` or CI secrets.

Notes

- The backend is implemented as Nuxt Nitro server routes for quick iteration and serverless-friendly deployment.
