/**
 * Static chrome copy and structure — the sitewide announcement bar, footer link
 * groups, social links, and accepted-payment badges.
 *
 * These live as structured constants rather than inline JSX literals so that
 * (a) Italian localisation can be layered on later without hunting through
 * components (issue #1 §Locale), and (b) the announcement copy has a single
 * home to swap for the homepage-metaobject wiring in a later ticket
 * (issue #1 §Chrome — "static text for now, re-wired to the homepage
 * metaobject in a later ticket").
 */

import { siteConfig } from "lib/site-config.mjs";

export type NavLink = {
  label: string;
  href: string;
  /** External links open in a new tab and bypass Next's client router. */
  external?: boolean;
};

export type FooterGroup = {
  heading: string;
  links: NavLink[];
};

/**
 * The storefront route for one of the store's content pages. Shopify pages
 * render at `/<handle>` through `app/[page]/page.tsx` — a single dynamic
 * segment, so a `/pages/...` href would 404. Taking the handle from
 * `siteConfig` keeps every chrome link pointing at a page the seed creates.
 */
const pagePath = (page: keyof typeof siteConfig.pages) =>
  `/${siteConfig.pages[page].handle}`;

/**
 * The announcement-bar messages, shown space-separated on every page. Static
 * for now; a later ticket re-sources this from the homepage metaobject. The
 * mockup's "houres" typo is corrected to "hours" here on purpose.
 */
export const ANNOUNCEMENT_MESSAGES = [
  "Shipping in 24/48 hours",
  "Free exchanges",
  "Easy returns",
] as const;

/**
 * Footer link groups (SERVICE / LEGAL / MORE), matching the concept.
 *
 * Every page link is built with `pagePath`, so the label is this file's
 * business and the handle is `siteConfig`'s. The labels stay shorter than the
 * page titles the seed writes ("Shipping policy" for "Shipping & Return
 * Policy") because that is what the concept's footer reads.
 */
export const FOOTER_GROUPS: FooterGroup[] = [
  {
    heading: "Service",
    links: [
      { label: "Contact", href: pagePath("contact") },
      { label: "Shipping policy", href: pagePath("shippingPolicy") },
      { label: "Cookie preferences", href: pagePath("cookiePreferences") },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", href: pagePath("privacyPolicy") },
      { label: "Terms of service", href: pagePath("termsOfService") },
      { label: "Refund policy", href: pagePath("refundPolicy") },
    ],
  },
  {
    heading: "More",
    links: [
      { label: "All products", href: "/search" },
      { label: "About", href: pagePath("about") },
      { label: "FAQ", href: pagePath("faq") },
    ],
  },
];

/**
 * The newsletter block above the footer (issue #11). Every string the form can
 * show lives here — including its success and failure lines — so the copy stays
 * structured for later localisation and the component holds only layout.
 *
 * The privacy note is split around its link because the link sits mid-sentence;
 * a translation reorders `before`/`after` rather than the markup.
 */
export const NEWSLETTER = {
  heading: "Newsletter",
  body: "Join the list and hear about the next drop before it sells out.",
  emailLabel: "Email address",
  placeholder: "your@email.com",
  submit: "Subscribe",
  submitting: "Subscribing",
  success: "You're on the list. Watch your inbox for the next drop.",
  errors: {
    invalidEmail: "That doesn't look like a valid email address.",
    failed: "Something went wrong. Please try again.",
  },
  privacyNote: {
    before: "We use your email to send drop news. See our ",
    linkLabel: "privacy policy",
    after: " for the details.",
    href: pagePath("privacyPolicy"),
  },
} as const;

export type SocialIcon = "instagram" | "tiktok" | "facebook";

export type SocialLink = {
  label: string;
  href: string;
  icon: SocialIcon;
};

/**
 * Social links shown in the footer. The URLs are placeholders pointing at each
 * platform until the client confirms the brand's real handles.
 */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
  { label: "TikTok", href: "https://www.tiktok.com/", icon: "tiktok" },
  { label: "Facebook", href: "https://www.facebook.com/", icon: "facebook" },
];

export type PaymentMethod = {
  /** Stable identity, used as the React list key. */
  id: string;
  /** Short wordmark rendered on the badge. */
  label: string;
};

/**
 * Accepted-payment badges shown in the footer's lower bar. Rendered as wordmark
 * chips (placeholder marks) until the client confirms the real accepted set.
 */
export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "visa", label: "VISA" },
  { id: "mastercard", label: "MC" },
  { id: "amex", label: "AMEX" },
  { id: "paypal", label: "PayPal" },
  { id: "applepay", label: "Apple Pay" },
  { id: "googlepay", label: "G Pay" },
];
