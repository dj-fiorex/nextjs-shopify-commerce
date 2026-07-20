import { ANNOUNCEMENT_MESSAGES } from "lib/chrome";
import { getHomepage } from "lib/shopify";
import { Fragment } from "react";

/**
 * The thin sitewide bar above the header — black ink base carrying the brand's
 * service promises. The copy comes from the homepage metaobject so the client
 * can edit it in Shopify admin; it falls back to the default phrases when the
 * entry is empty or unseeded.
 *
 * On narrow screens the phrases wrap and centre without separators; from `sm`
 * up they sit on one line divided by pipes, matching the concept.
 */
export default async function AnnouncementBar() {
  const homepage = await getHomepage();
  const messages = homepage?.announcement?.length
    ? homepage.announcement
    : ANNOUNCEMENT_MESSAGES;

  return (
    <div className="bg-brand-ink text-brand-base">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-0.5 px-4 py-2 text-center font-mono text-[11px] tracking-wide uppercase sm:gap-x-4 sm:text-xs sm:tracking-widest">
        {messages.map((message, index) => (
          <Fragment key={`${index}-${message}`}>
            {index > 0 ? (
              <span aria-hidden className="hidden text-brand-base/40 sm:inline">
                |
              </span>
            ) : null}
            <span>{message}</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
