/**
 * Site identity. The env vars stay overridable for the eventual cutover to the
 * client's own store, but they default to the brand rather than to the
 * template's placeholders, so an unset var can never render "undefined".
 */
export const SITE_NAME = process.env.SITE_NAME || "CrazySociety";

export const COMPANY_NAME = process.env.COMPANY_NAME || SITE_NAME;

export const SITE_DESCRIPTION =
  "CrazySociety — Italian streetwear. Raw, mono, unmistakable.";

/**
 * The butterfly mark: black ink on transparency, so it is only ever placed on
 * the brand's white base. It is a wide 1.47:1 lockup, not a square, so its
 * intrinsic dimensions travel with the path wherever the mark is drawn.
 */
export const LOGO = {
  path: "/brand/crazysociety-butterfly.png",
  width: 487,
  height: 332,
} as const;
