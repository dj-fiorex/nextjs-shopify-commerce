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
 * Hrefs point at the pages the seed creates (`/pages/<handle>`). A few items
 * the concept names — Contact, Cookie preferences — are not seeded as pages
 * yet; the links still render so the chrome matches the mockup, and pointing
 * the seed at them is a content follow-up, not chrome scope.
 */
export const FOOTER_GROUPS: FooterGroup[] = [
  {
    heading: "Service",
    links: [
      { label: "Contact", href: "/pages/contact" },
      { label: "Shipping policy", href: "/pages/shipping-return-policy" },
      { label: "Cookie preferences", href: "/pages/cookie-preferences" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", href: "/pages/privacy-policy" },
      { label: "Terms of service", href: "/pages/terms-conditions" },
      { label: "Refund policy", href: "/pages/refund-policy" },
    ],
  },
  {
    heading: "More",
    links: [
      { label: "All products", href: "/search" },
      { label: "About", href: "/pages/about" },
      { label: "FAQ", href: "/pages/frequently-asked-questions" },
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
    // Shopify pages render at `/<handle>` (see `app/[page]/page.tsx`).
    href: "/privacy-policy",
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
