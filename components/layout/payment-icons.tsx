import { PAYMENT_METHODS } from "lib/chrome";

/**
 * Accepted-payment badges for the footer. Rendered as small bordered wordmark
 * chips rather than the providers' colour logos, so they stay on-brand with the
 * mono, black-ink footer. Exposed as a labelled list ("Accepted payment
 * methods") since which methods are accepted is meaningful to shoppers.
 */
export default function PaymentIcons() {
  if (!PAYMENT_METHODS.length) return null;

  return (
    <ul aria-label="Accepted payment methods" className="flex flex-wrap gap-2">
      {PAYMENT_METHODS.map((method) => (
        <li
          key={method.id}
          className="flex h-6 min-w-[2.5rem] items-center justify-center rounded border border-neutral-300 px-1.5 font-mono text-[9px] font-semibold tracking-wide text-neutral-500 uppercase"
        >
          {method.label}
        </li>
      ))}
    </ul>
  );
}
