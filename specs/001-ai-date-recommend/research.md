# research.md

Decision: Tech stack and integrations for AI Date Course Recommendation

Rationale: The user requested a TypeScript + Nuxt project using Vite as build tool. Nuxt 3 uses Vite by default and supports server-side routes (Nitro), enabling a unified monorepo-style web app with frontend pages and backend endpoints in the same project. Targeting South Korea allows choosing well-supported local APIs.

---

## Decisions

- Decision: Use TypeScript as the single language across frontend and server routes.

  - Rationale: Developer ergonomics, type-safety, and the user's request.
  - Alternatives considered: JavaScript (less safe), full backend in another language (increases complexity).

- Decision: Use Nuxt 3 (Vue 3) for the frontend with Vite as bundler.

  - Rationale: Nuxt 3 integrates Vite, supports SSR/SSG, and provides Nitro server routes for backend endpoints which reduces infra complexity for an MVP.
  - Alternatives considered: Next.js (React) — good, but user requested Nuxt.

- Decision: Use Nuxt Nitro server routes for backend API (co-located with frontend) for MVP.

  - Rationale: Simplifies project structure and deployment (serverless-friendly). For larger scale, split into dedicated backend service.

- Decision: Primary place & geocoding provider for South Korea: Kakao Local API.

  - Rationale: Kakao Local has strong Korean coverage for geocoding and place search. Alternative: Nominatim / OpenStreetMap (global, but variable quality for Korea).

- Decision: Event sourcing strategy:

  - For recent incidents: use NewsAPI.org (or local news APIs) where permissible; for Korean-specific sources prioritize providers that index Korean news.
  - For historical facts: prefer Wikipedia (structured pages) and local curated datasets.
  - Fallback: curated short summaries when no verifiable source link is available (per user choice Q2: B).

- Decision: Caching & storage (MVP): in-memory LRU caching for API results, no persistent DB. Use Redis in later phases if persistent caching or user shortlists are required.

- Decision: Testing stack:

  - Unit: Vitest (TypeScript-friendly)
  - Integration/E2E: Playwright
  - Contract tests: OpenAPI-based contract validation (e.g., using openapi-backend or spectral in CI)

- Decision: Local dev & quickstart: use pnpm (preferred) or npm with pinned Node.js version (>=18)

---

## Research tasks (Phase 0)

- Task: Confirm quotas, authentication flows, and costs for Kakao Local API and NewsAPI (or any chosen news provider).
- Task: Define fallback rules when external APIs fail or have insufficient coverage (e.g., present curated summaries, show "no events found").
- Task: Prepare sample queries (20) for Korean neighborhoods to validate provider coverage.

## Outputs required from research.md

- Pick concrete providers (Kakao Local API + NewsAPI + Wikipedia) and list required credentials & rate limits.
- Sample API response examples for one or two queries to shape data-model.md schema.
