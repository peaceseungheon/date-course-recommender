# Frontend (Date Course Recommender)

This is the Nuxt 3 frontend for the Date Course Recommender (MVP).

Environment variables

- KAKAO_API_KEY (server-only): Kakao Local API key. Needed to enable real place searches.
- NEWSAPI_KEY (optional): NewsAPI key to enable news-based event enrichment.

Local development

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Export keys (zsh example):

```bash
export KAKAO_API_KEY="your_kakao_key"
# optional
export NEWSAPI_KEY="your_newsapi_key"
```

3. Start dev server:

```bash
npm run dev
```

4. Visit:

- http://localhost:3000/search — search UI
- http://localhost:3000/shortlist — view saved shortlist

Testing

- Unit tests: `npm run test:unit` (runs Vitest unit tests)
- E2E tests: `npm run test:e2e` (Playwright) — requires browsers and environment setup

Notes and next steps

- The Kakao provider is used server-side when `KAKAO_API_KEY` is present. For local testing without a real key, unit tests mock the network.
- Place detail requests use a best-effort lookup via Kakao (keyword search); a production implementation should persist place documents or use a more deterministic mapping.
- Event enrichment uses Wikipedia and optional NewsAPI; improve ranking and query disambiguation in future iterations.
