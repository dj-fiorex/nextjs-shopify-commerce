import { SectionHeading } from "components/homepage/section-heading";
import { getCollectionProducts } from "lib/shopify";
import type { HomepageCollectionRef, Product } from "lib/shopify/types";
import type { ReactNode } from "react";

/**
 * The shell shared by the homepage's collection-backed sections — Summer Drop
 * and Best Sellers (issue #6). It resolves the collection the homepage
 * metaobject references (falling back to a seeded handle so the section still
 * renders before the client links one in admin), fetches and caps its products,
 * and lays out the heading with its "View all" link. The caller renders the body
 * from the products it receives, so each section keeps its own layout.
 *
 * An empty collection hides the whole section rather than showing an empty
 * shell, matching the drop's graceful-degradation contract (issue #1).
 */
export async function ProductSection({
  title,
  collection,
  fallbackHandle,
  limit,
  children,
}: {
  title: string;
  collection?: HomepageCollectionRef;
  fallbackHandle: string;
  limit: number;
  children: (products: Product[]) => ReactNode;
}) {
  const handle = collection?.handle ?? fallbackHandle;
  const products = (await getCollectionProducts({ collection: handle })).slice(
    0,
    limit,
  );

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 min-[1320px]:px-0">
      <SectionHeading
        title={title}
        viewAllHref={collection?.path ?? `/search/${handle}`}
      />
      {children(products)}
    </section>
  );
}
