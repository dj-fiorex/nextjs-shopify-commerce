import Link from "next/link";

/**
 * The heading row shared by the homepage product sections: a mono, uppercase
 * title on the brand base with an optional "View all" link through to the
 * section's collection (issue #1 user story 13). Kept in one place so the drop,
 * Best Sellers, and later sections read consistently.
 */
export function SectionHeading({
  title,
  viewAllHref,
}: {
  title: string;
  viewAllHref?: string;
}) {
  return (
    <div className="mb-8 flex items-baseline justify-between gap-4">
      <h2 className="font-mono text-2xl tracking-[0.2em] text-brand-ink uppercase sm:text-3xl">
        {title}
      </h2>
      {viewAllHref ? (
        <Link
          href={viewAllHref}
          prefetch={true}
          className="shrink-0 font-mono text-xs tracking-widest text-neutral-500 uppercase underline-offset-4 hover:text-brand-ink hover:underline"
        >
          View all
        </Link>
      ) : null}
    </div>
  );
}
