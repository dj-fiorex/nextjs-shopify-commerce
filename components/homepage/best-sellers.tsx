import { ProductSection } from "components/homepage/product-section";
import { ProductCard } from "components/product/product-card";
import type { Homepage } from "lib/shopify/types";
import { siteConfig } from "lib/site-config.mjs";

const BEST_SELLERS_TITLE = "Best Sellers";

/** The concept's Best Sellers grid is a fixed six products. */
const BEST_SELLERS_COUNT = 6;

/**
 * The homepage Best Sellers grid (issue #6): six products from the collection
 * the homepage metaobject references, each on the shared product card so
 * seeded sold-out products carry the same "Sold out" badge as everywhere else.
 */
export function BestSellers({ homepage }: { homepage?: Homepage }) {
  return (
    <ProductSection
      title={BEST_SELLERS_TITLE}
      collection={homepage?.bestSellersCollection}
      fallbackHandle={siteConfig.collections.bestSellers}
      limit={BEST_SELLERS_COUNT}
    >
      {(products) => (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.handle}
              product={product}
              sizes="(min-width: 768px) 33vw, 50vw"
            />
          ))}
        </div>
      )}
    </ProductSection>
  );
}
