import { ANNOUNCEMENT_MESSAGES } from "lib/chrome";
import { Fragment } from "react";

/**
 * The thin sitewide bar above the header — black ink base carrying the brand's
 * service promises. Copy is static for now (issue #4); a later ticket
 * re-sources it from the homepage metaobject.
 *
 * On narrow screens the phrases wrap and centre without separators; from `sm`
 * up they sit on one line divided by pipes, matching the concept.
 */
export default function AnnouncementBar() {
  return (
    <div className="bg-brand-ink text-brand-base">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-0.5 px-4 py-2 text-center font-mono text-[11px] tracking-wide uppercase sm:gap-x-4 sm:text-xs sm:tracking-widest">
        {ANNOUNCEMENT_MESSAGES.map((message, index) => (
          <Fragment key={message}>
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
