---
name: verify
description: How to run and verify this storefront end-to-end in a browser. Use before committing changes that affect rendered pages or the cart flow.
---

# Verifying this storefront

The agreed verification seam (spec issue #1) is the running app's browser
surface against the seeded demo store — no unit tests, no mocked GraphQL.
`pnpm test` is only a Prettier check.

## Launch

```bash
pnpm dev   # Next.js on http://localhost:3000, reads Shopify creds from .env
```

Ready in ~1s. If Shopify env is missing, `lib/shopify` logs "Skipping…" and
pages render empty — check `.env` has the SHOPIFY\_\* vars before diagnosing.

## Drive

Use the `agent-browser` skill (`agent-browser open <url>`, `snapshot -i`,
`click @eN`, `screenshot`).

Useful seeded URLs (see `scripts/crazysociety-catalog.mjs` for the full list):

- `/product/belty-tee` — 4 images, all sizes available, spec lines seeded
- `/product/chicano-windbreaker` — fully sold out (disabled sizes + button)
- `/search` — bare catalog grid
- `/` — homepage sections (metaobject-driven)

## Flows worth driving

- PDP: thumbnail click swaps main image (`?image=N` in URL); size click
  selects (`?size=X`); Add to cart opens the cart overlay with the right
  variant and EUR price; sold-out product shows disabled struck-through
  sizes and a disabled "Sold out" button.
- Mobile: `agent-browser set viewport 390 844` and re-screenshot.

## Gotchas

- Adding to cart persists in the browser profile across `agent-browser open`
  calls — the cart badge carries over between page loads in one session.
- `agent-browser screenshot --full-page` is not a valid flag; plain
  `screenshot <path>` only captures the viewport.
