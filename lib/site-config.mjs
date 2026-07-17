/**
 * Every store-specific identifier the storefront reads lives here.
 *
 * The build currently points at a seeded demo store; the client's real store is
 * a later cutover. Keeping the handles in one module is what makes that cutover
 * a config-only change, so read them from here rather than inlining a literal
 * at the call site. `scripts/seed-shopify.mjs` imports this same module, so the
 * collections the seed writes and the ones the app reads cannot drift apart.
 *
 * Plain `.mjs` (not `.ts`) so the Node seed script and the Next app can share
 * one definition. TypeScript infers the literal types through it.
 */

export const siteConfig = {
  collections: {
    /** Seasonal drop featured on the homepage. Renamed per drop by the client. */
    summerDrop: "summer-drop",
    /** Best Sellers grid on the homepage. */
    bestSellers: "best-sellers",
    /**
     * Template-era collections. The homepage redesign replaces the sections
     * that read these; they stay until then so the stock homepage still renders.
     */
    homepageFeatured: "hidden-homepage-featured-items",
    homepageCarousel: "hidden-homepage-carousel",
  },
};
