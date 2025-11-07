# tasks.md — AI Date Course Recommendation

Feature: AI Date Course Recommendation
Branch: 001-ai-date-recommend
Spec: specs/001-ai-date-recommend/spec.md
Plan: specs/001-ai-date-recommend/plan.md
Contracts: specs/001-ai-date-recommend/contracts/openapi.yaml

## Overview

This tasks file is organized by phase (Setup → Foundational → User Stories → Polish). Each user story is independently implementable and testable. Tasks follow the strict checklist format required by the repository's speckit tooling.

---

## Phase 1 — Setup (project initialization)

- [x] T001 Create repository-level `frontend/` Nuxt 3 project scaffold (nuxt.config.ts, package.json) at `frontend/` (file path: `frontend/nuxt.config.ts`, `frontend/package.json`)
- [x] T002 [P] Add package manager scripts and dependencies to `frontend/package.json` (pnpm scripts: dev, build, test, test:e2e) (file path: `frontend/package.json`)
- [x] T003 Create `.env.example` with placeholders for `KAKAO_API_KEY` and `NEWSAPI_KEY` (file path: `.env.example`)
- [x] T004 [P] Add basic README snippet to `specs/001-ai-date-recommend/quickstart.md` (update existing file) (file path: `specs/001-ai-date-recommend/quickstart.md`)
- [x] T005 Initialize testing config: `vitest.config.ts` and Playwright config under `frontend/tests/playwright.config.ts` (file path: `frontend/vitest.config.ts`, `frontend/tests/playwright.config.ts`)

## Phase 2 — Foundational (blocking prerequisites)

- [x] T006 Create TypeScript types and models for domain entities (User Query, Place, Recommendation, Event) at `frontend/src/types/ai-recommender.d.ts` (file path: `frontend/src/types/ai-recommender.d.ts`)
- [x] T007 [P] Create a lightweight provider abstraction `frontend/src/services/placeProvider.ts` with stubbed methods: `geocode(q)`, `searchNearby(coords, limit)`, `getPlaceById(id)` (file path: `frontend/src/services/placeProvider.ts`)
- [x] T008 Create caching helper `frontend/src/lib/cache.ts` implementing a simple in-memory LRU with TTL for API responses (file path: `frontend/src/lib/cache.ts`)
- [x] T009 Add mock data fixtures for tests at `specs/001-ai-date-recommend/tests/fixtures/mock-results.json` (file path: `specs/001-ai-date-recommend/tests/fixtures/mock-results.json`)
- [x] T010 Create server route skeletons for API endpoints under Nitro layout: `frontend/server/api/search.ts` and `frontend/server/api/places/[id].ts` (file path: `frontend/server/api/search.ts`, `frontend/server/api/places/[id].ts`)
- [x] T011 Wire OpenAPI contract check harness: `specs/001-ai-date-recommend/contracts/contract-test.js` that validates `specs/001-ai-date-recommend/contracts/openapi.yaml` against runtime responses (file path: `specs/001-ai-date-recommend/contracts/contract-test.js`)

## Phase 3 — User Story 1 (P1) — Get curated date suggestions (Priority: P1)

Goal: Implement `GET /api/search?q={location}` returning 3–7 recommendations with at least one event when available.
Independent test criteria: Given `q=서울시 광진구 화양동` the endpoint returns HTTP 200 and JSON with `recommendations` array length >=3 and for at least one recommendation `events` array length >=1.

- [x] T012 [US1] Create service `frontend/src/services/searchService.ts` that: accepts free-text query, calls `placeProvider.geocode`, `placeProvider.searchNearby`, enriches places with reason_text and event candidates, and returns normalized Recommendation objects (file path: `frontend/src/services/searchService.ts`)
- [x] T013 [US1] Implement endpoint `frontend/server/api/search.ts` to call `searchService` and return JSON (file path: `frontend/server/api/search.ts`)
- [x] T014 [US1] Implement unit tests for `searchService` using Vitest and fixture `specs/001-ai-date-recommend/tests/fixtures/mock-results.json` (file path: `frontend/tests/unit/searchService.test.ts`)
- [x] T015 [US1] Implement contract test that calls `GET /api/search?q=서울시 광진구 화양동` and validates response shape against `specs/001-ai-date-recommend/contracts/openapi.yaml` (file path: `specs/001-ai-date-recommend/contracts/contract-test.js`)
- [x] T016 [US1] Add caching to `searchService` responses using `frontend/src/lib/cache.ts` (file path: `frontend/src/services/searchService.ts`)
- [x] T017 [US1] Add a small UI page to display search results at `frontend/pages/search.vue` that fetches `/api/search?q=` and renders the recommendations list (file path: `frontend/pages/search.vue`)
- [x] T018 [US1] Create an E2E Playwright test that simulates a user entering `서울시 광진구 화양동` and asserts at least 3 results appear (file path: `frontend/tests/e2e/search.spec.ts`)

## Phase 4 — User Story 2 (P2) — Inspect and compare suggestions (Priority: P2)

Goal: Implement place detail view and events display.
Independent test criteria: `GET /api/places/{id}` returns place object and `events` array (may be empty) with `summary` and `source_label` or `source_url`.

- [ ] T019 [US2] Implement `frontend/server/api/places/[id].ts` endpoint to return place detail + events using `placeProvider.getPlaceById` and event enrichment (file path: `frontend/server/api/places/[id].ts`)
- [ ] T020 [US2] Create service `frontend/src/services/placeService.ts` to fetch and normalize single place details and events (file path: `frontend/src/services/placeService.ts`)
- [ ] T021 [US2] Implement unit tests for `placeService` (file path: `frontend/tests/unit/placeService.test.ts`)
- [ ] T022 [US2] Create UI detail page `frontend/pages/places/[id].vue` displaying place metadata and events (file path: `frontend/pages/places/[id].vue`)
- [ ] T023 [US2] Create E2E Playwright spec to open one result from search page and verify event summary and source presence (file path: `frontend/tests/e2e/place-detail.spec.ts`)

## Phase 5 — User Story 3 (P3) — Save or share a shortlist (Priority: P3)

Goal: Allow user to save 1–3 items to a session-stored shortlist and share or export as a simple list.
Independent test criteria: From search results, marking an item as saved places item into client-side shortlist view for the session.

- [ ] T024 [US3] Implement client-side shortlist store `frontend/src/stores/shortlist.ts` (Pinia or simple composable) persisting in sessionStorage (file path: `frontend/src/stores/shortlist.ts`)
- [ ] T025 [US3] Add UI controls in `frontend/pages/search.vue` to save/remove items and a `frontend/pages/shortlist.vue` to view saved items (file path: `frontend/pages/shortlist.vue`)
- [ ] T026 [US3] Add unit tests for shortlist store and small UI interaction tests (file path: `frontend/tests/unit/shortlist.test.ts`)

## Final Phase — Polish & Cross-cutting concerns

- [ ] T027 Create CI workflow skeleton `.github/workflows/ci.yml` that runs `pnpm install`, `pnpm test`, and contract test script (file path: `.github/workflows/ci.yml`)
- [ ] T028 [P] Update `specs/001-ai-date-recommend/quickstart.md` with exact commands and example request/response snippets (file path: `specs/001-ai-date-recommend/quickstart.md`)
- [ ] T029 [P] Add license and CODE_OF_CONDUCT to repo root (file path: `LICENSE`, `CODE_OF_CONDUCT.md`)
- [ ] T030 Run full validation: ensure `specs/001-ai-date-recommend/checklists/requirements.md` items are checked and update `specs/001-ai-date-recommend/checklists/validation_results.md` with final status (file path: `specs/001-ai-date-recommend/checklists/validation_results.md`)

---

## Dependencies & Execution Order

1. Phase 1 (T001–T005) must complete before Phase 2.
2. Phase 2 (T006–T011) must complete before user story implementations can be validated.
3. User Story 1 (T012–T018) is the MVP slice and should be implemented first.
4. User Story 2 (T019–T023) depends on US1 for the search flow to produce place ids.
5. User Story 3 (T024–T026) is independent of backend work but depends on UI search page (T017).
6. Final Phase tasks (T027–T030) can run in parallel once core features are present.

## Parallel execution examples

- While T006 (types) is in progress, T007 (placeProvider abstraction) and T008 (cache) can be implemented in parallel: `T007 [P]` and `T008`.
- UI pages (T017, T022, T025) can be worked on in parallel with backend stubs if the endpoint contracts are stable: `T017 [P]`, `T022 [P]`, `T025 [P]`.
- Unit tests for individual services (T014, T021, T026) can be implemented in parallel by different engineers: `T014 [P]`, `T021 [P]`, `T026 [P]`.

## Task counts & summary

- Total tasks: 30
- Tasks per story:
  - Setup/Foundational: 11 (T001–T011)
  - US1: 7 (T012–T018)
  - US2: 5 (T019–T023)
  - US3: 3 (T024–T026)
  - Polish: 4 (T027–T030)
- Parallel opportunities identified: many tasks marked `[P]` and the Parallel execution examples section above.

## Independent test criteria (per user story)

- US1: `GET /api/search?q=서울시 광진구 화양동` → HTTP 200, `recommendations.length >= 3`, at least one recommendation with `events.length >= 1` (contract + unit + e2e tests cover this).
- US2: `GET /api/places/{id}` → HTTP 200, response contains `place` and `events` (each event has `summary` and `source_label` or `source_url` when available).
- US3: Saving items results in `sessionStorage` containing saved place ids and the `frontend/pages/shortlist.vue` renders them in the session.

## Suggested MVP scope

- Implement Phase1 + Phase2 + User Story 1 (T001–T018). This delivers an independently testable MVP: search with recommendations and at least one event per area when available.

## Format validation

- All tasks adhere to the required checklist format: each line begins with `- [ ]` followed by a TaskID and, for story tasks, the story label (e.g., `[US1]`). Each task includes at least one file path where work should be performed.

---

End of tasks.md
