import type { Homepage } from "lib/shopify/types";

/**
 * The full-bleed brand video (issue #7). It autoplays muted and loops so the
 * brand's energy plays without the shopper pressing anything, and `playsInline`
 * keeps mobile Safari from taking it fullscreen. The source is the promo video
 * on the homepage metaobject, so the client swaps it per drop from Shopify
 * admin; the poster falls back to the video's own preview frame while it loads.
 *
 * With no video seeded the section renders nothing rather than an empty band,
 * matching the homepage's graceful-degradation contract (issue #1). It sits on
 * the brand's ink so any letterboxing reads as an intentional black frame.
 */
export function VideoSection({ homepage }: { homepage?: Homepage }) {
  const video = homepage?.promoVideo;

  if (!video) {
    return null;
  }

  return (
    <section className="w-full bg-brand-ink">
      {/* Muted + looping + no controls: a decorative brand loop, not a player. */}
      <video
        className="block w-full"
        poster={video.previewImage?.url}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={video.url} type={video.mimeType} />
      </video>
    </section>
  );
}
