/**
 * The PDP spec block (issue #9): the product description rendered as the
 * brand's mono spec lines — "100% COTTON / 350 GSM / WASHING INSTRUCTIONS: /
 * 30 DEGREES".
 *
 * The seed stores each spec line as its own `<p>` in the description
 * (`descriptionHtml` in scripts/crazysociety-catalog.mjs), so the parse is the
 * inverse of that encoding: one line per block-level element, tags stripped.
 * A description written free-form in Shopify admin still renders — each of its
 * paragraphs becomes a line — so the block degrades to a plain mono description
 * rather than breaking.
 */

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

const ENTITY_PATTERN = new RegExp(Object.keys(ENTITIES).join("|"), "g");

function parseSpecLines(descriptionHtml: string): string[] {
  return descriptionHtml
    .split(/<\/(?:p|li|h[1-6]|div)>|<br\s*\/?>/i)
    .map((block) =>
      block
        .replace(/<[^>]*>/g, " ")
        .replace(ENTITY_PATTERN, (entity) => ENTITIES[entity]!)
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
}

export function ProductSpecs({ descriptionHtml }: { descriptionHtml: string }) {
  const lines = parseSpecLines(descriptionHtml);

  if (!lines.length) {
    return null;
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {lines.map((line, index) => (
        <li
          key={`${index}-${line}`}
          className="font-mono text-xs tracking-widest text-brand-ink"
        >
          {line}
        </li>
      ))}
    </ul>
  );
}
