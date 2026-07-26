import { SHOPIFY_ADMIN_GRAPHQL_API_ENDPOINT } from "lib/constants";
import { ensureStartsWith } from "lib/utils";
import type { ExtractVariables } from "./types";

/**
 * Minimal Admin API client for the one thing the storefront can't do over the
 * Storefront API: write a customer with email-marketing consent (issue #11).
 *
 * Server-only — it holds admin credentials, so it must never be imported from a
 * client component. Everything the storefront renders still comes from
 * `lib/shopify/index.ts` over the Storefront API.
 *
 * Credentials mirror `scripts/seed-shopify.mjs`: either a long-lived
 * `SHOPIFY_ADMIN_ACCESS_TOKEN`, or a Dev Dashboard app's client ID/secret which
 * are exchanged for a 24h token. The app needs the `write_customers` scope
 * (plus `read_customers`, to find an existing subscriber) — without it Shopify
 * rejects the call and the signup form reports a generic failure.
 */

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const endpoint = domain ? `${domain}${SHOPIFY_ADMIN_GRAPHQL_API_ENDPOINT}` : "";
const staticToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const clientId = process.env.SHOPIFY_CLIENT_ID;
const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

// Renew a little before Shopify's stated expiry so a token can't go stale
// mid-flight on a request that was issued right at the boundary.
const TOKEN_EXPIRY_MARGIN_MS = 60_000;

type CachedToken = { value: string; expiresAt: number };

let cachedToken: CachedToken | undefined;
// Concurrent submits share one exchange rather than each burning a token.
let pendingExchange: Promise<string> | undefined;

/**
 * Whether an Admin API call can even be attempted. Callers check this first so
 * an unconfigured deployment fails with an explanation instead of a network
 * error, and so nothing here throws at import time.
 */
export function isAdminApiConfigured(): boolean {
  return Boolean(endpoint && (staticToken || (clientId && clientSecret)));
}

// https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/client-credentials-grant
async function exchangeClientCredentials(): Promise<string> {
  const res = await fetch(`${domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok || !body.access_token) {
    throw new Error(
      `Shopify admin token exchange failed (HTTP ${res.status}). Check that the ` +
        "app is installed on this store and SHOPIFY_CLIENT_ID/SECRET are correct.",
    );
  }

  cachedToken = {
    value: body.access_token,
    expiresAt:
      Date.now() +
      (Number(body.expires_in) || 3600) * 1000 -
      TOKEN_EXPIRY_MARGIN_MS,
  };

  return cachedToken.value;
}

async function adminToken(): Promise<string> {
  if (staticToken) {
    return staticToken;
  }

  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  if (!pendingExchange) {
    pendingExchange = exchangeClientCredentials();
    // Clear on settle either way: a failed exchange must not poison the next
    // submit, and a successful one is served from `cachedToken` afterwards.
    // `.finally` derives a promise nobody awaits, so its rejection is swallowed
    // here — the caller below is the one that reports the failure.
    pendingExchange
      .finally(() => {
        pendingExchange = undefined;
      })
      .catch(() => {});
  }

  return pendingExchange;
}

/**
 * Runs one Admin API GraphQL operation, returning its `data`. Throws on
 * transport, auth, and GraphQL errors; per-mutation `userErrors` are part of
 * `data` and belong to the caller, which knows which ones are benign.
 */
export async function adminFetch<T extends { data: unknown }>({
  query,
  variables,
}: {
  query: string;
  variables?: ExtractVariables<T>;
}): Promise<T["data"]> {
  if (!isAdminApiConfigured()) {
    throw new Error(
      "Shopify Admin API is not configured. Set SHOPIFY_STORE_DOMAIN and either " +
        "SHOPIFY_ADMIN_ACCESS_TOKEN or SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET.",
    );
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": await adminToken(),
    },
    body: JSON.stringify({ query, ...(variables && { variables }) }),
    cache: "no-store",
  });

  const body = await res.json().catch(() => ({}));

  // Admin API auth and scope failures answer with `errors` as a plain string
  // ("[api] This action requires merchant approval for write_customers scope"),
  // while query-level failures use the usual array of objects.
  if (body.errors) {
    const message =
      typeof body.errors === "string"
        ? body.errors
        : body.errors
            .map((error: { message: string }) => error.message)
            .join("; ");
    throw new Error(`Shopify Admin API error (HTTP ${res.status}): ${message}`);
  }

  if (!res.ok) {
    throw new Error(`Shopify Admin API responded HTTP ${res.status}`);
  }

  return body.data;
}
