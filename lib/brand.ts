/**
 * Site identity. The env vars stay overridable for the eventual cutover to the
 * client's own store, but they default to the brand rather than to the
 * template's placeholders, so an unset var can never render "undefined".
 */
export const SITE_NAME = process.env.SITE_NAME || "CrazySociety";

export const COMPANY_NAME = process.env.COMPANY_NAME || SITE_NAME;

/** The butterfly mark, as served to the browser and to the OG image renderer. */
export const LOGO_PATH = "/brand/crazysociety-butterfly.png";

/** Intrinsic size of the mark; it is a wide 1.47:1 lockup, not a square. */
export const LOGO_WIDTH = 487;
export const LOGO_HEIGHT = 332;
