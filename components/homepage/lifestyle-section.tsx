import type { Homepage } from "lib/shopify/types";
import Image from "next/image";

/**
 * The full-bleed lifestyle photo (issue #7) — a single editorial image between
 * Best Sellers and About Us, sourced from the homepage metaobject so the client
 * swaps it per drop. Taller on phones and letterbox-wide on larger screens so it
 * fills the width without a portrait crop on desktop.
 *
 * Hidden entirely when no image is seeded, matching the homepage's
 * graceful-degradation contract (issue #1).
 */
export function LifestyleSection({ homepage }: { homepage?: Homepage }) {
  const image = homepage?.lifestyleImage;

  if (!image) {
    return null;
  }

  return (
    <section className="relative aspect-[4/5] w-full sm:aspect-[16/9]">
      <Image
        src={image.url}
        alt={image.altText}
        fill
        sizes="100vw"
        className="object-cover"
      />
    </section>
  );
}
