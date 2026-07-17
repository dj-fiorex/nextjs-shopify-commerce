/**
 * Seeds a fresh Shopify store with everything this template expects:
 *
 *   - The CrazySociety catalog: the mockup products from `crazysociety-catalog.mjs`,
 *     each with a Size S-XXL option, spec description, and images from the
 *     client's live store, grouped into the `summer-drop` and `best-sellers`
 *     collections. Two products are seeded sold out.
 *   - Collections: `hidden-homepage-featured-items` (homepage grid, needs >= 3 products)
 *                  `hidden-homepage-carousel`       (homepage carousel, needs >= 1 product)
 *   - Menus:       `next-js-frontend-header-menu`   (navbar)
 *                  `next-js-frontend-footer-menu`   (footer)
 *   - Pages:       about, terms-conditions, shipping-return-policy,
 *                  privacy-policy, frequently-asked-questions
 *   - Sample products (only if the store has fewer than 3), published to all
 *     sales channels so the Storefront API can see them.
 *
 * Requirements:
 *   - SHOPIFY_STORE_DOMAIN in .env (already used by the app)
 *   - Credentials for a Dev Dashboard app (dev.shopify.com) installed on the
 *     store, with access scopes: read_products, write_products,
 *     read_publications, write_publications, write_online_store_navigation,
 *     write_content. Either:
 *       SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET  (from the app's Settings
 *         page — the script exchanges them for a 24h admin token), or
 *       SHOPIFY_ADMIN_ACCESS_TOKEN  (a shpat_... token, if you have one)
 *
 * Usage: node scripts/seed-shopify.mjs
 *
 * The script is idempotent: it checks by handle before creating anything.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { siteConfig } from "../lib/site-config.mjs";
import {
  CRAZYSOCIETY_HANDLES,
  CRAZYSOCIETY_PRODUCTS,
  SIZE_OPTION,
  SIZES,
  descriptionHtml,
  productsInCollection,
} from "./crazysociety-catalog.mjs";

const API_VERSION = "2025-10";

const {
  summerDrop: SUMMER_DROP_COLLECTION,
  bestSellers: BEST_SELLERS_COLLECTION,
  homepageFeatured: FEATURED_COLLECTION,
  homepageCarousel: CAROUSEL_COLLECTION,
} = siteConfig.collections;

const HEADER_MENU = "next-js-frontend-header-menu";
const FOOTER_MENU = "next-js-frontend-footer-menu";

const SAMPLE_PRODUCTS = [
  { handle: "acme-t-shirt", title: "Acme T-Shirt", price: "20.00" },
  { handle: "acme-hoodie", title: "Acme Hoodie", price: "50.00" },
  { handle: "acme-cap", title: "Acme Cap", price: "18.00" },
  { handle: "acme-mug", title: "Acme Mug", price: "15.00" },
  { handle: "acme-tote-bag", title: "Acme Tote Bag", price: "12.00" },
  { handle: "acme-sticker", title: "Acme Sticker", price: "4.00" },
];

const PAGES = [
  { handle: "about", title: "About" },
  { handle: "terms-conditions", title: "Terms & Conditions" },
  { handle: "shipping-return-policy", title: "Shipping & Return Policy" },
  { handle: "privacy-policy", title: "Privacy Policy" },
  { handle: "frequently-asked-questions", title: "Frequently Asked Questions" },
];

// --- env ---------------------------------------------------------------

function loadEnv() {
  const env = {};
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    // no .env file, rely on process.env
  }
  return { ...env, ...process.env };
}

const env = loadEnv();
const domain = (env.SHOPIFY_STORE_DOMAIN || "").replace(/^https?:\/\//, "");
const clientId = env.SHOPIFY_CLIENT_ID;
const clientSecret = env.SHOPIFY_CLIENT_SECRET;
let adminToken = env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!domain || (!adminToken && !(clientId && clientSecret))) {
  console.error(
    "Missing credentials. Needed in .env:\n" +
      "  SHOPIFY_STORE_DOMAIN=your-store.myshopify.com\n" +
      "and either\n" +
      "  SHOPIFY_CLIENT_ID=...        (Dev Dashboard > your app > Settings)\n" +
      "  SHOPIFY_CLIENT_SECRET=...\n" +
      "or\n" +
      "  SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_...\n\n" +
      "The app must be installed on the store with these access scopes:\n" +
      "read_products, write_products, read_publications, write_publications,\n" +
      "write_online_store_navigation, write_content",
  );
  process.exit(1);
}

// Exchange client credentials for a 24h Admin API token (Dev Dashboard apps).
// https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/client-credentials-grant
async function fetchAdminToken() {
  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) {
    throw new Error(
      `Token exchange failed (HTTP ${res.status}): ${JSON.stringify(body)}\n` +
        "Check that the app is installed on this store and the client ID/secret are correct.",
    );
  }
  console.log(`Obtained admin token (scopes: ${body.scope || "unknown"})`);
  return body.access_token;
}

// --- graphql client ----------------------------------------------------

async function gql(query, variables = {}) {
  const res = await fetch(
    `https://${domain}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({ query, variables }),
    },
  );
  const body = await res.json();
  if (body.errors?.length) {
    throw new Error(body.errors.map((e) => e.message).join("; "));
  }
  return body.data;
}

function assertNoUserErrors(payload, label) {
  const errors = payload?.userErrors;
  if (errors?.length) {
    throw new Error(`${label}: ${errors.map((e) => e.message).join("; ")}`);
  }
}

// --- steps ---------------------------------------------------------------

async function verifyAuth() {
  const data = await gql(`{ shop { name } }`);
  console.log(`Connected to shop: ${data.shop.name} (${domain})`);
}

async function getPublications() {
  try {
    const data = await gql(`{ publications(first: 20) { nodes { id name } } }`);
    return data.publications.nodes;
  } catch (e) {
    console.warn(
      `! Could not list sales channels (${e.message}). Skipping auto-publish —\n` +
        "  make sure products/collections are published to your Storefront API's\n" +
        "  channel (e.g. Headless or your custom app) in Shopify admin.",
    );
    return [];
  }
}

async function publish(id, publications, label) {
  for (const pub of publications) {
    try {
      const data = await gql(
        `mutation publish($id: ID!, $input: [PublicationInput!]!) {
          publishablePublish(id: $id, input: $input) {
            userErrors { message }
          }
        }`,
        { id, input: [{ publicationId: pub.id }] },
      );
      const errors = data.publishablePublish.userErrors;
      // "already published" style errors are fine to ignore
      if (errors?.length && !/already/i.test(errors[0].message)) {
        console.warn(`  ! ${label} -> ${pub.name}: ${errors[0].message}`);
      }
    } catch (e) {
      console.warn(`  ! ${label} -> ${pub.name}: ${e.message}`);
    }
  }
}

// Shopify's media fetcher rejects picsum's 302 redirect, so resolve it to the
// final signed fastly URL first and hand Shopify a direct image/jpeg link.
async function resolveImageUrl(seed) {
  const source = `https://picsum.photos/seed/${seed}/1200/1200.jpg`;
  try {
    const res = await fetch(source, { method: "HEAD", redirect: "follow" });
    const type = res.headers.get("content-type") || "";
    if (res.ok && type.startsWith("image/")) return res.url;
  } catch {
    // fall through to placeholder
  }
  return `https://placehold.co/1200x1200/jpg?text=${encodeURIComponent(seed)}`;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function attachMedia(productId, images, alt, label) {
  const result = await gql(
    `mutation productCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
      productCreateMedia(productId: $productId, media: $media) {
        media { ... on MediaImage { id } }
        mediaUserErrors { field message }
      }
    }`,
    {
      productId,
      media: images.map((url) => ({
        originalSource: url,
        alt,
        mediaContentType: "IMAGE",
      })),
    },
  );
  const errors = result.productCreateMedia.mediaUserErrors;
  if (errors?.length) {
    console.warn(`  ! ${label}: ${errors[0].message}`);
    return false;
  }
  console.log(`  + ${images.length} image(s) queued for ${label}`);
  return true;
}

// Attaches picsum placeholders to the template's own sample products. Catalog
// products are excluded — they get real photography in ensureCatalogImages().
async function ensureProductImages() {
  const data = await gql(
    `{ products(first: 50, query: "status:active") { nodes { id title handle featuredMedia { id } } } }`,
  );
  const missing = data.products.nodes.filter(
    (p) => !p.featuredMedia && !CRAZYSOCIETY_HANDLES.has(p.handle),
  );
  if (!missing.length) {
    console.log("All sample products already have images.");
    return;
  }

  console.log(
    `Attaching placeholder images to ${missing.length} product(s)...`,
  );
  for (const product of missing) {
    const url = await resolveImageUrl(product.handle);
    await attachMedia(product.id, [url], product.title, product.handle);
  }
}

// Media is processed asynchronously; wait until every product has a ready image.
async function waitForProductImages() {
  process.stdout.write("Waiting for Shopify to process images");
  for (let attempt = 0; attempt < 18; attempt++) {
    const check = await gql(
      `{ products(first: 50, query: "status:active") {
        nodes { handle featuredMedia { ... on MediaImage { image { url } } } }
      } }`,
    );
    const pending = check.products.nodes.filter(
      (p) => !p.featuredMedia?.image?.url,
    );
    if (!pending.length) {
      console.log("\nAll product images are ready.");
      return;
    }
    await sleep(5000);
    process.stdout.write(".");
  }
  console.warn(
    "\n! Some images are still processing (or failed). Check Products in the Shopify admin.",
  );
}

async function findProductByHandle(handle) {
  const data = await gql(
    `query find($q: String!) { products(first: 1, query: $q) { nodes { id handle } } }`,
    { q: `handle:${handle}` },
  );
  return data.products.nodes[0] ?? null;
}

// --- CrazySociety catalog -------------------------------------------------

const PRODUCT_SET = `mutation productSet($input: ProductSetInput!) {
  productSet(input: $input, synchronous: true) {
    product { id title handle }
    userErrors { field message }
  }
}`;

function catalogProductInput(product) {
  return {
    title: product.title,
    handle: product.handle,
    descriptionHtml: descriptionHtml(product),
    status: "ACTIVE",
    productOptions: [
      { name: SIZE_OPTION, values: SIZES.map((name) => ({ name })) },
    ],
    variants: SIZES.map((size) => ({
      optionValues: [{ optionName: SIZE_OPTION, name: size }],
      price: product.price,
      // A tracked variant with no stock reports availableForSale: false over the
      // Storefront API, which is what drives the "Sold out" badge and the
      // disabled size on the PDP. Everything else stays untracked so the demo
      // store can't drift to sold out as carts and test orders accumulate.
      inventoryPolicy: product.soldOut ? "DENY" : "CONTINUE",
      inventoryItem: { tracked: Boolean(product.soldOut) },
    })),
    files: product.images.map((url) => ({
      originalSource: url,
      alt: product.title,
      contentType: "IMAGE",
    })),
  };
}

async function ensureCatalogProducts(publications) {
  console.log("\nSeeding the CrazySociety catalog...");
  for (const product of CRAZYSOCIETY_PRODUCTS) {
    const found = await findProductByHandle(product.handle);
    if (found) {
      console.log(`  = product exists: ${product.handle}`);
      await publish(found.id, publications, product.handle);
      continue;
    }

    const input = catalogProductInput(product);
    let data = await gql(PRODUCT_SET, { input });
    if (data.productSet.userErrors?.length) {
      // Image fetch can fail; create the product anyway and let
      // ensureCatalogImages() attach the photography on this or a later run.
      console.warn(
        `  ! ${product.handle}: ${data.productSet.userErrors[0].message} — retrying without images`,
      );
      const { files, ...withoutFiles } = input;
      data = await gql(PRODUCT_SET, { input: withoutFiles });
      assertNoUserErrors(data.productSet, `productSet(${product.handle})`);
    }
    console.log(
      `  + created product: ${product.handle}${product.soldOut ? " (sold out)" : ""}`,
    );
    await publish(data.productSet.product.id, publications, product.handle);
  }
}

// Covers the product-created-but-image-fetch-failed case above: without this a
// blank product would survive every future run, since the handle already exists.
async function ensureCatalogImages() {
  const data = await gql(
    `query find($q: String!) {
      products(first: 50, query: $q) {
        nodes { id handle media(first: 1) { nodes { id } } }
      }
    }`,
    { q: CRAZYSOCIETY_PRODUCTS.map((p) => `handle:${p.handle}`).join(" OR ") },
  );

  const blank = data.products.nodes.filter((n) => !n.media.nodes.length);
  if (!blank.length) {
    console.log("All catalog products already have images.");
    return;
  }

  console.log(`Attaching live-site images to ${blank.length} product(s)...`);
  for (const node of blank) {
    const product = CRAZYSOCIETY_PRODUCTS.find((p) => p.handle === node.handle);
    await attachMedia(node.id, product.images, product.title, product.handle);
  }
}

async function ensureProducts(publications) {
  const existing = await gql(
    `{ products(first: 50, query: "status:active") { nodes { id title handle } } }`,
  );
  let products = existing.products.nodes;

  if (products.length >= 3) {
    console.log(
      `Store already has ${products.length} active product(s) — using those, no samples created.`,
    );
    return products;
  }

  console.log(
    `Store has ${products.length} active product(s) — creating sample products...`,
  );

  for (const sample of SAMPLE_PRODUCTS) {
    const found = await findProductByHandle(sample.handle);
    if (found) {
      console.log(`  = product exists: ${sample.handle}`);
      continue;
    }

    const input = {
      title: sample.title,
      handle: sample.handle,
      descriptionHtml: `<p>${sample.title} — sample product created by the seed script. Replace it with your real catalog.</p>`,
      status: "ACTIVE",
      productOptions: [{ name: "Title", values: [{ name: "Default Title" }] }],
      variants: [
        {
          optionValues: [{ optionName: "Title", name: "Default Title" }],
          price: sample.price,
        },
      ],
      files: [
        {
          originalSource: await resolveImageUrl(sample.handle),
          alt: sample.title,
          contentType: "IMAGE",
        },
      ],
    };

    const mutation = `mutation productSet($input: ProductSetInput!) {
      productSet(input: $input, synchronous: true) {
        product { id title handle }
        userErrors { field message }
      }
    }`;

    let data = await gql(mutation, { input });
    if (data.productSet.userErrors?.length) {
      // Image fetch can fail; retry without the image rather than aborting.
      console.warn(
        `  ! ${sample.handle}: ${data.productSet.userErrors[0].message} — retrying without image`,
      );
      const { files, ...withoutFiles } = input;
      data = await gql(mutation, { input: withoutFiles });
      assertNoUserErrors(data.productSet, `productSet(${sample.handle})`);
    }
    console.log(`  + created product: ${sample.handle}`);
  }

  const refreshed = await gql(
    `{ products(first: 50, query: "status:active") { nodes { id title handle } } }`,
  );
  products = refreshed.products.nodes;

  for (const product of products) {
    await publish(product.id, publications, product.handle);
  }

  return products;
}

async function ensureCollection(
  handle,
  title,
  productIds,
  publications,
  description,
) {
  const existing = await gql(
    `query find($q: String!) {
      collections(first: 1, query: $q) {
        nodes { id handle products(first: 50) { nodes { id } } }
      }
    }`,
    { q: `handle:${handle}` },
  );

  let collection = existing.collections.nodes[0];

  if (!collection) {
    const data = await gql(
      `mutation collectionCreate($input: CollectionInput!) {
        collectionCreate(input: $input) {
          collection { id handle }
          userErrors { field message }
        }
      }`,
      {
        input: {
          title,
          handle,
          descriptionHtml: `<p>${description}</p>`,
          products: productIds,
        },
      },
    );
    assertNoUserErrors(data.collectionCreate, `collectionCreate(${handle})`);
    collection = data.collectionCreate.collection;
    console.log(
      `+ created collection: ${handle} (${productIds.length} products)`,
    );
  } else {
    const current = new Set(collection.products.nodes.map((p) => p.id));
    const missing = productIds.filter((id) => !current.has(id));
    if (missing.length) {
      const data = await gql(
        `mutation add($id: ID!, $productIds: [ID!]!) {
          collectionAddProductsV2(id: $id, productIds: $productIds) {
            userErrors { field message }
          }
        }`,
        { id: collection.id, productIds: missing },
      );
      assertNoUserErrors(
        data.collectionAddProductsV2,
        `collectionAddProductsV2(${handle})`,
      );
      console.log(
        `= collection exists: ${handle} — added ${missing.length} product(s)`,
      );
    } else {
      console.log(`= collection exists: ${handle} — nothing to do`);
    }
  }

  await publish(collection.id, publications, handle);
}

async function ensurePages() {
  const created = [];
  for (const page of PAGES) {
    try {
      const existing = await gql(
        `query find($q: String!) { pages(first: 1, query: $q) { nodes { id handle } } }`,
        { q: `handle:${page.handle}` },
      );
      if (existing.pages.nodes[0]) {
        console.log(`= page exists: ${page.handle}`);
        created.push(page);
        continue;
      }
      const data = await gql(
        `mutation pageCreate($page: PageCreateInput!) {
          pageCreate(page: $page) {
            page { id handle }
            userErrors { field message }
          }
        }`,
        {
          page: {
            title: page.title,
            handle: page.handle,
            isPublished: true,
            body: `<p>Placeholder content for the <strong>${page.title}</strong> page. Edit it in Shopify admin under Online Store &gt; Pages.</p>`,
          },
        },
      );
      assertNoUserErrors(data.pageCreate, `pageCreate(${page.handle})`);
      console.log(`+ created page: ${page.handle}`);
      created.push(page);
    } catch (e) {
      console.warn(
        `! Skipping page "${page.handle}": ${e.message}\n` +
          "  (pages need the write_content scope — you can also create them manually)",
      );
    }
  }
  return created;
}

async function ensureMenu(handle, title, items) {
  const existing = await gql(`{ menus(first: 50) { nodes { id handle } } }`);
  if (existing.menus.nodes.some((menu) => menu.handle === handle)) {
    console.log(`= menu exists: ${handle}`);
    return;
  }
  const data = await gql(
    `mutation menuCreate($title: String!, $handle: String!, $items: [MenuItemCreateInput!]!) {
      menuCreate(title: $title, handle: $handle, items: $items) {
        menu { id handle }
        userErrors { field message }
      }
    }`,
    { title, handle, items },
  );
  assertNoUserErrors(data.menuCreate, `menuCreate(${handle})`);
  console.log(`+ created menu: ${handle}`);
}

// --- main ----------------------------------------------------------------

try {
  if (!adminToken) {
    adminToken = await fetchAdminToken();
  }
  await verifyAuth();

  const publications = await getPublications();

  await ensureCatalogProducts(publications);
  await ensureCatalogImages();

  // Runs after the catalog, so a seeded store is already past the 3-product
  // threshold and no Acme samples are created.
  const products = await ensureProducts(publications);
  await ensureProductImages();
  await waitForProductImages();

  if (products.length < 3) {
    console.warn(
      "! Fewer than 3 products available — the homepage featured grid will not render.",
    );
  }

  const byHandle = new Map(products.map((p) => [p.handle, p.id]));
  const collectionProductIds = (handle) =>
    productsInCollection(handle)
      .map((p) => byHandle.get(p.handle))
      .filter(Boolean);

  await ensureCollection(
    SUMMER_DROP_COLLECTION,
    "Summer Drop",
    collectionProductIds(SUMMER_DROP_COLLECTION),
    publications,
    "The current seasonal drop, featured on the homepage.",
  );
  await ensureCollection(
    BEST_SELLERS_COLLECTION,
    "Best Sellers",
    collectionProductIds(BEST_SELLERS_COLLECTION),
    publications,
    "The best-selling products, shown in the homepage Best Sellers grid.",
  );

  const productIds = products.map((p) => p.id);
  await ensureCollection(
    FEATURED_COLLECTION,
    "Homepage Featured Items",
    productIds.slice(0, 3),
    publications,
    'Products shown in the homepage featured section. Collections prefixed with "hidden-" are excluded from the search page.',
  );
  await ensureCollection(
    CAROUSEL_COLLECTION,
    "Homepage Carousel",
    productIds,
    publications,
    'Products shown in the homepage carousel. Collections prefixed with "hidden-" are excluded from the search page.',
  );

  const pages = await ensurePages();

  await ensureMenu(HEADER_MENU, "Next.js Frontend Header Menu", [
    { title: "All", type: "HTTP", url: "/search" },
  ]);
  await ensureMenu(FOOTER_MENU, "Next.js Frontend Footer Menu", [
    { title: "Home", type: "HTTP", url: "/" },
    ...pages.map((page) => ({
      title: page.title,
      type: "HTTP",
      url: `/pages/${page.handle}`,
    })),
  ]);

  console.log(
    "\nDone. Notes:\n" +
      "  - Product images are fetched asynchronously by Shopify; give it a minute.\n" +
      "  - If the homepage is still empty, check that products are published to the\n" +
      "    sales channel your Storefront API token belongs to (Headless / custom app).\n" +
      "  - Restart `pnpm dev` or wait for cache revalidation to see fresh data.",
  );
} catch (e) {
  console.error(`\nSeed failed: ${e.message}`);
  process.exit(1);
}
