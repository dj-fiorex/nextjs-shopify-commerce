"use client";

import clsx from "clsx";
import { addItem } from "components/cart/actions";
import { Product, ProductVariant } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useCart } from "./cart-context";

/**
 * The PDP purchase button in the brand treatment (issue #9): a full-width ink
 * block with mono uppercase copy. A fully sold-out product reads "Sold out",
 * disabled; with no size picked yet the button waits, disabled, until the
 * shopper chooses.
 */
function SubmitButton({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const disabled = !availableForSale || !selectedVariantId;

  return (
    <button
      aria-label={
        !availableForSale
          ? "Sold out"
          : !selectedVariantId
            ? "Please select an option"
            : "Add to cart"
      }
      disabled={disabled}
      className={clsx(
        "flex w-full items-center justify-center bg-brand-ink px-6 py-4 font-mono text-sm tracking-widest text-brand-base uppercase",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "transition-opacity hover:opacity-80",
      )}
    >
      {availableForSale ? "Add to cart" : "Sold out"}
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const addItemAction = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  )!;

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product);
        addItemAction();
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
