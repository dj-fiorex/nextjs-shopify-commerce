import { ProductCard } from "components/product/product-card";
import type { Product } from "lib/shopify/types";

/**
 * The catalog's bare product grid (issue #8): the shared product card in the
 * concept's clean two-column layout, with no collections sidebar or sort chrome
 * around it. It backs every product listing that resolves under `/search` — the
 * full catalog, a single collection, and header search results — so all three
 * read as the same grid.
 *
 * Two columns hold at every width, matching the mockup and the homepage drop
 * cards; the `sizes` hint tells `next/image` each card spans roughly half the
 * viewport, capped by the catalog container on desktop.
 */
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6">
      {products.map((product) => (
        <ProductCard
          key={product.handle}
          product={product}
          sizes="(min-width: 1280px) 600px, 50vw"
        />
      ))}
    </div>
  );
}
