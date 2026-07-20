import Logo from "components/logo";
import { SITE_NAME } from "lib/brand";
import type { Homepage } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";

/**
 * The full-bleed homepage hero — the first thing a shopper lands on. The drop's
 * hero photo (from the homepage metaobject) sits full-bleed behind the brand's
 * butterfly mark; a light scrim keeps the black-ink mark legible over any photo.
 *
 * The content is client-editable in Shopify admin, so every part degrades: with
 * no seeded entry the mark still renders on the brand's white base, and the
 * "Shop the drop" call to action only appears once a drop collection is linked.
 */
export function Hero({ homepage }: { homepage?: Homepage }) {
  const heroImage = homepage?.heroImage;
  const dropTitle = homepage?.dropTitle;
  const dropCollection = homepage?.dropCollection;

  return (
    <section className="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden bg-brand-base">
      {heroImage ? (
        <>
          <Image
            src={heroImage.url}
            alt={heroImage.altText || `${SITE_NAME} — ${dropTitle ?? "drop"}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* White scrim: the butterfly mark is black ink, so it needs a light
              base to read against, whatever the photo behind it. */}
          <div aria-hidden className="absolute inset-0 bg-brand-base/40" />
        </>
      ) : null}

      <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
        {/* The Logo's own alt text carries the brand name for screen readers. */}
        <Logo className="h-16 sm:h-24" priority />
        {dropTitle ? (
          <p className="font-mono text-sm tracking-[0.3em] text-brand-ink uppercase sm:text-base">
            {dropTitle}
          </p>
        ) : null}
        {dropCollection ? (
          <Link
            href={dropCollection.path}
            className="border border-brand-ink bg-brand-base px-6 py-2 font-mono text-xs tracking-widest text-brand-ink uppercase transition-colors hover:bg-brand-ink hover:text-brand-base"
          >
            Shop the drop
          </Link>
        ) : null}
      </div>
    </section>
  );
}
