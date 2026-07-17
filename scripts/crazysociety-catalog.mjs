/**
 * The CrazySociety mockup catalog, as seed data for `seed-shopify.mjs`.
 *
 * Sources, and where they disagree:
 *
 *   - Titles and prices come from the concept PDF (spec issue #1), which is the
 *     agreed target. The live store's prices differ slightly (59.99 vs 59,90;
 *     Militia Tee is 34.99 there against the mockup's 43,90) — the mockup wins,
 *     since it is what the client signed off on.
 *   - Images and spec copy come from crazysoc.com, the client's own live store.
 *   - Sizes are authored: the live store stocks S–XL with inconsistent option
 *     naming ("SIZE" vs "Dimensione", upper and lower case). The spec calls for
 *     a uniform Size S–XXL on every product.
 *
 * Titles are stored in title case and uppercased by the design layer, so the
 * mono product-label treatment stays a styling concern rather than baked-in data.
 *
 * `specs` render as the product description; the PDP reads its spec lines back
 * out of it. Four products have no spec copy on the live site — their lines are
 * marked PLACEHOLDER and need real values from the client before go-live.
 */

import { siteConfig } from "../lib/site-config.mjs";

const { summerDrop, bestSellers } = siteConfig.collections;

export const SIZES = ["S", "M", "L", "XL", "XXL"];

export const SIZE_OPTION = "Size";

/**
 * `price` below is a bare amount, so it takes the store's own currency —
 * the seed checks the store matches this rather than trusting it.
 */
export const CATALOG_CURRENCY = "EUR";

const CDN = "https://cdn.shopify.com/s/files/1/1038/5037/7558/files";

export const CRAZYSOCIETY_PRODUCTS = [
  {
    handle: "belty-tee",
    title: "Belty Tee",
    price: "59.90",
    specs: ["100% COTTON", "350 GSM", "WASHING INSTRUCTIONS:", "30 DEGREES"],
    collections: [summerDrop, bestSellers],
    images: [
      `${CDN}/F24AA735-B117-45A8-806B-EB8D07F5761E.jpg`,
      `${CDN}/4DCAF88A-1328-4F39-8A54-DD56EEF39FAF.png`,
      `${CDN}/988268D5-6A6F-4A44-BE4F-81082C9A03EC.png`,
      `${CDN}/35947E08-1809-479E-BDA0-679B4531DD70.jpg`,
    ],
  },
  {
    handle: "cage-shorts",
    title: "Cage Shorts",
    price: "69.90",
    specs: [
      "100% POLYESTER",
      "BAGGY FIT",
      "WASHING INSTRUCTIONS:",
      "30 DEGREES",
    ],
    collections: [summerDrop, bestSellers],
    images: [
      `${CDN}/3F994886-7D3A-4CAA-AE48-C99479828867.jpg`,
      `${CDN}/928EDD36-0395-4F07-A08A-CF536BC001C0.jpg`,
      `${CDN}/3AC22CAD-C480-4914-99AC-295E21EF58B3.jpg`,
      `${CDN}/26C09AF5-837E-4F1F-AC47-A09027646B24.jpg`,
    ],
  },
  {
    handle: "scarf-hoodie",
    title: "Scarf Hoodie",
    price: "89.90",
    specs: [
      "100% COTTON",
      "MADE IN ITALY",
      "300 GSM",
      "WASHING INSTRUCTIONS:",
      "30 DEGREES",
    ],
    collections: [bestSellers],
    images: [
      `${CDN}/IMG-3439.jpg`,
      `${CDN}/IMG-3440.jpg`,
      `${CDN}/Immagine2026-06-17002732.png`,
      `${CDN}/Immagine2026-06-17002717.png`,
    ],
  },
  {
    handle: "jogger",
    title: "Jogger",
    price: "59.90",
    specs: [
      "100% COTTON",
      "DESIGNED & MADE IN ITALY",
      "300 GSM",
      "WASHING INSTRUCTIONS:",
      "30 DEGREES",
      "HAND WASH",
    ],
    collections: [summerDrop, bestSellers],
    images: [
      `${CDN}/10B6E10E-7803-42D9-9DA9-C981FBAFF59B.jpg`,
      `${CDN}/F7F5DB2A-7CEC-44A5-9A21-3ECB4DA9C7A6.jpg`,
      `${CDN}/Immagine2026-06-17004416.png`,
    ],
  },
  {
    handle: "chicano-windbreaker",
    title: "Chicano Windbreaker",
    price: "69.90",
    // PLACEHOLDER specs — no copy on the live site.
    specs: [
      "100% NYLON",
      "WATER RESISTANT",
      "WASHING INSTRUCTIONS:",
      "30 DEGREES",
    ],
    soldOut: true,
    collections: [bestSellers],
    images: [
      `${CDN}/wind_161cb498-e55d-4f08-98f4-6455a709cefe.png`,
      `${CDN}/Immagine2026-06-17011300.png`,
      `${CDN}/Immagine2026-06-17011311.png`,
    ],
  },
  {
    handle: "chicano-zip-shorts",
    title: "Chicano Zip-Shorts",
    price: "29.90",
    // PLACEHOLDER specs — no copy on the live site.
    specs: ["100% COTTON", "WASHING INSTRUCTIONS:", "30 DEGREES"],
    soldOut: true,
    collections: [summerDrop],
    images: [
      `${CDN}/Immagine2026-06-17011513.png`,
      `${CDN}/Immagine2026-06-17011539.png`,
      `${CDN}/Immagine2026-06-17011550.png`,
    ],
  },
  {
    handle: "chicano-zips-jorts",
    title: "Chicano Zips-Jorts",
    price: "49.90",
    // PLACEHOLDER specs — no copy on the live site.
    specs: ["100% COTTON DENIM", "WASHING INSTRUCTIONS:", "30 DEGREES"],
    collections: [summerDrop],
    images: [`${CDN}/Immagine_2026-06-17_015150.png`],
  },
  {
    handle: "raid-jacket",
    title: "Raid Jacket",
    price: "79.90",
    specs: [
      "REFLECTIVE BANDS",
      "EMBROIDERED LOGO",
      "ADJUSTABLE WAISTBAND AND HOOD",
    ],
    collections: [bestSellers],
    images: [
      `${CDN}/Immagine2026-06-17010902.png`,
      `${CDN}/Immagine2026-06-17010926.png`,
    ],
  },
  {
    handle: "guerrilla-jeans",
    title: "Guerrilla Jeans",
    price: "89.90",
    // PLACEHOLDER specs — no copy on the live site.
    specs: ["100% COTTON DENIM", "WASHING INSTRUCTIONS:", "30 DEGREES"],
    collections: [bestSellers],
    images: [
      `${CDN}/IMG-3445.jpg`,
      `${CDN}/IMG-3446.jpg`,
      `${CDN}/Immagine2026-06-17010236.png`,
    ],
  },
  {
    handle: "militia-tee",
    title: "Militia Tee",
    price: "43.90",
    specs: ["100% COTTON", "280 GSM", "WASHING INSTRUCTIONS:", "30 DEGREES"],
    collections: [summerDrop, bestSellers],
    images: [`${CDN}/1950F2E8-F0FF-4A72-ACD9-601139CD3796.jpg`],
  },
];

/** Spec lines render one per line, matching the live store's markup. */
export function descriptionHtml(product) {
  return product.specs.map((line) => `<p>${line}</p>`).join("\n");
}

export const CRAZYSOCIETY_HANDLES = new Set(
  CRAZYSOCIETY_PRODUCTS.map((p) => p.handle),
);

/** Products belonging to a collection, in catalog order. */
export function productsInCollection(handle) {
  return CRAZYSOCIETY_PRODUCTS.filter((p) => p.collections.includes(handle));
}
