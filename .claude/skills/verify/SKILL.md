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
- Newsletter (above the footer on every page): the form's own refs are easiest
  to drive by selector rather than `@eN` —

  ```bash
  agent-browser fill "#newsletter-email" "someone@example.com"
  agent-browser click "form:has(#newsletter-email) button[type=submit]"
  agent-browser get text "#newsletter-status"   # inline success / error line
  ```

  A bad address must answer with the invalid-email line without any network
  call; a good one must answer with the success line, and submitting it a
  second time must answer the same way (no duplicate-customer error). Confirm
  the write landed in Shopify admin under Customers — the record should read
  "Subscribed" for email marketing.

## Gotchas

- Adding to cart persists in the browser profile across `agent-browser open`
  calls — the cart badge carries over between page loads in one session.
- The newsletter signup is the one storefront feature that calls the **Admin**
  API (creating a customer with marketing consent is impossible over the
  Storefront API). It needs `read_customers` + `write_customers` on the app
  behind `SHOPIFY_CLIENT_ID`/`SHOPIFY_CLIENT_SECRET` — without them Shopify
  answers "Access denied for customers field", the form shows its generic
  failure line, and `pnpm dev`'s log carries the real reason. Scopes are
  granted in the Shopify Dev Dashboard, then the app is re-installed on the
  store; a token minted before the change does not carry them.
- `agent-browser screenshot --full-page` is not a valid flag; plain
  `screenshot <path>` only captures the viewport.
