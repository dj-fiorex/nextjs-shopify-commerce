import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import { Product } from "lib/shopify/types";
import { ProductSpecs } from "./product-specs";
import { VariantSelector } from "./variant-selector";

/**
 * The PDP buy box (issue #9): mono uppercase title and EUR price, the size
 * selector, the spec lines, then the add-to-cart into the existing cart
 * overlay — the concept's product column, in the order the mockup lists it.
 */
export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-8 flex flex-col gap-3 border-b border-neutral-200 pb-8">
        <h1 className="font-mono text-2xl tracking-[0.15em] text-brand-ink uppercase sm:text-3xl">
          {product.title}
        </h1>
        <Price
          className="text-base text-brand-ink"
          amount={product.priceRange.maxVariantPrice.amount}
          currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          currencyCodeClassName="text-neutral-500"
        />
      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      {product.descriptionHtml ? (
        <div className="mb-8">
          <ProductSpecs descriptionHtml={product.descriptionHtml} />
        </div>
      ) : null}
      <AddToCart product={product} />
    </>
  );
}
