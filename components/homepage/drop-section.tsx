import { ProductSection } from "components/homepage/product-section";
import { ProductCard } from "components/product/product-card";
import type { Homepage } from "lib/shopify/types";
import { siteConfig } from "lib/site-config.mjs";
import Image from "next/image";

/** Shown when the metaobject has no drop title yet, so the section still reads. */
const DROP_TITLE_FALLBACK = "Summer Drop";

/** Cards shown beside the lookbook — a 2×2 set; the rest live behind "View all". */
const DROP_PRODUCT_LIMIT = 4;

/**
 * The homepage's current-drop section (issue #6). The drop title and lookbook
 * photo come from the homepage metaobject; the cards come from the collection
 * that entry references. Photo and cards sit side by side on desktop and stack
 * on mobile, per the concept. With no lookbook seeded yet the cards fill the
 * row on their own, so the section still reads.
 */
export function DropSection({ homepage }: { homepage?: Homepage }) {
  const title = homepage?.dropTitle ?? DROP_TITLE_FALLBACK;
  const lookbook = homepage?.lookbookImage;

  return (
    <ProductSection
      title={title}
      collection={homepage?.dropCollection}
      fallbackHandle={siteConfig.collections.summerDrop}
      limit={DROP_PRODUCT_LIMIT}
    >
      {(products) => {
        const cards = products.map((product) => (
          <ProductCard
            key={product.handle}
            product={product}
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
        ));

        return lookbook ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 lg:aspect-auto lg:h-full">
              <Image
                src={lookbook.url}
                alt={lookbook.altText || `${title} lookbook`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">{cards}</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {cards}
          </div>
        );
      }}
    </ProductSection>
  );
}
