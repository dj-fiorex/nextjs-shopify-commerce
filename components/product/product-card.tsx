import clsx from "clsx";
import Price from "components/price";
import type { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";

/**
 * The shared product card behind the storefront's product grids — the homepage
 * Summer Drop and Best Sellers sections today, the catalog next.
 *
 * Brand treatment (issue #1 §Design system): the product photo on the white
 * base, then a mono, uppercase name and an EUR price beneath it. Unavailable
 * products carry a "Sold out" badge and a dimmed photo, so a shopper reads the
 * state before clicking through. The whole card is the link to the PDP.
 *
 * `sizes` defaults to a four-up grid; callers in denser or sparser layouts pass
 * their own so `next/image` requests an appropriately sized source.
 */
export function ProductCard({
  product,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
}: {
  product: Product;
  sizes?: string;
}) {
  const { featuredImage, title, handle, availableForSale, priceRange } =
    product;
  const price = priceRange.maxVariantPrice;

  return (
    <Link
      href={`/product/${handle}`}
      prefetch={true}
      className="group flex flex-col gap-3"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        {featuredImage ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.altText || title}
            fill
            sizes={sizes}
            className={clsx(
              "object-cover transition duration-500 ease-out group-hover:scale-105",
              { "opacity-60": !availableForSale },
            )}
          />
        ) : null}
        {!availableForSale ? (
          <span className="absolute top-3 left-3 bg-brand-ink px-2 py-1 font-mono text-[10px] tracking-widest text-brand-base uppercase">
            Sold out
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-mono text-xs tracking-wide text-brand-ink uppercase">
          {title}
        </h3>
        <Price
          className="text-sm text-neutral-500"
          amount={price.amount}
          currencyCode={price.currencyCode}
          currencyCodeClassName="text-neutral-400"
        />
      </div>
    </Link>
  );
}
