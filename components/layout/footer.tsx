import Logo from "components/logo";
import PaymentIcons from "components/layout/payment-icons";
import SocialLinks from "components/layout/social-icons";
import { NewsletterSignup } from "components/newsletter/newsletter-signup";
import { COMPANY_NAME, SITE_DESCRIPTION, SITE_NAME } from "lib/brand";
import { FOOTER_GROUPS } from "lib/chrome";
import Link from "next/link";

/**
 * The sitewide footer (issue #4): brand mark and social row, the SERVICE /
 * LEGAL / MORE link groups, and a lower bar with the copyright and
 * accepted-payment badges. Link groups are static config (see `lib/chrome.ts`)
 * so the copy stays structured for later localisation.
 *
 * The newsletter block (issue #11) is emitted just above it, as its own band —
 * the concept puts it there, and every page that shows the footer should show
 * it, which is exactly the four callers this component already has.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");
  const copyrightName = COMPANY_NAME;
  const linkClasses =
    "text-neutral-500 underline-offset-4 transition-colors hover:text-brand-ink hover:underline";

  return (
    <>
      <NewsletterSignup />
      <footer className="border-t border-neutral-200 text-brand-ink">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4 md:gap-12 min-[1320px]:px-0">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Link
              href="/"
              aria-label={`${SITE_NAME} home`}
              className="inline-flex w-fit items-center"
            >
              <Logo className="h-6" />
              <span className="sr-only">{SITE_NAME}</span>
            </Link>
            <p className="max-w-xs text-sm text-neutral-500">
              {SITE_DESCRIPTION}
            </p>
            <SocialLinks />
          </div>

          {FOOTER_GROUPS.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="font-mono text-xs tracking-widest text-brand-ink uppercase">
                {group.heading}
              </h2>
              <ul className="mt-4 flex flex-col gap-2 text-sm">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className={linkClasses}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        prefetch={true}
                        className={linkClasses}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-neutral-200">
          <div className="mx-auto flex w-full max-w-7xl flex-col-reverse items-center gap-4 px-6 py-6 md:flex-row md:justify-between min-[1320px]:px-0">
            <p className="text-xs text-neutral-500">
              &copy; {copyrightDate} {copyrightName}
              {copyrightName.length && !copyrightName.endsWith(".")
                ? "."
                : ""}{" "}
              All rights reserved.
            </p>
            <PaymentIcons />
          </div>
        </div>
      </footer>
    </>
  );
}
