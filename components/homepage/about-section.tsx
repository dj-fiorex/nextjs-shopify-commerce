import type { Homepage } from "lib/shopify/types";

/**
 * The dark About Us section (issue #7): the brand manifesto ("CREATE YOUR
 * CHANCE.") inverted onto black ink — the concept's one deliberately dark band.
 * Heading and body come from the homepage metaobject so the client rewrites the
 * story per drop; `whitespace-pre-line` keeps the body's line breaks as set.
 *
 * The whole section is hidden when both heading and body are empty, and a single
 * empty field simply drops out, matching the homepage's graceful-degradation
 * contract (issue #1).
 */
export function AboutSection({ homepage }: { homepage?: Homepage }) {
  const heading = homepage?.aboutHeading;
  const body = homepage?.aboutBody;

  if (!heading && !body) {
    return null;
  }

  return (
    <section className="w-full bg-brand-ink text-brand-base">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
        {heading ? (
          <h2 className="font-mono text-3xl tracking-[0.2em] uppercase sm:text-4xl">
            {heading}
          </h2>
        ) : null}
        {body ? (
          <p className="max-w-2xl text-base leading-relaxed whitespace-pre-line text-neutral-300">
            {body}
          </p>
        ) : null}
      </div>
    </section>
  );
}
