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
  /**
   * The content pages the store carries. The seed creates each one with
   * placeholder copy for the client to replace, and the footer links to it.
   *
   * A page renders at `/<handle>` — `app/[page]/page.tsx` is a single dynamic
   * segment, so there is no `/pages` prefix (the menu reshaping in
   * `lib/shopify/index.ts` strips one for the same reason). Handles live here
   * because both sides read them: a link built from this list can't point at a
   * page the seed never created.
   */
  pages: {
    about: { handle: "about", title: "About" },
    contact: { handle: "contact", title: "Contact" },
    cookiePreferences: {
      handle: "cookie-preferences",
      title: "Cookie Preferences",
    },
    faq: {
      handle: "frequently-asked-questions",
      title: "Frequently Asked Questions",
    },
    privacyPolicy: { handle: "privacy-policy", title: "Privacy Policy" },
    refundPolicy: { handle: "refund-policy", title: "Refund Policy" },
    shippingPolicy: {
      handle: "shipping-return-policy",
      title: "Shipping & Return Policy",
    },
    termsOfService: { handle: "terms-conditions", title: "Terms & Conditions" },
  },
  metafields: {
    /**
     * Per-product size-chart image (a file metafield). The seed creates the
     * definition and attaches placeholder charts; the client swaps in real
     * measurement charts from admin (product page > Metafields). The PDP shows
     * its Size Chart button only when the product has one.
     */
    sizeChart: {
      namespace: "custom",
      key: "size_chart",
    },
  },
  metaobjects: {
    /**
     * The homepage content model. The client edits a single entry from Shopify
     * admin to drive the drop's marketing content — hero, lookbook, promo video,
     * About Us copy, announcement bar text, and the featured collections.
     *
     * `type` and `handle` name the definition and its one entry; `fields` are the
     * metaobject field keys. The seed writes these and the storefront reads them,
     * so keeping the keys here is what stops the two sides from drifting apart.
     */
    homepage: {
      type: "homepage",
      handle: "homepage",
      fields: {
        heroImage: "hero_image",
        dropTitle: "drop_title",
        dropCollection: "drop_collection",
        lookbookImage: "lookbook_image",
        promoVideo: "promo_video",
        bestSellersCollection: "best_sellers_collection",
        lifestyleImage: "lifestyle_image",
        aboutHeading: "about_heading",
        aboutBody: "about_body",
        announcement: "announcement",
      },
    },
  },
};
