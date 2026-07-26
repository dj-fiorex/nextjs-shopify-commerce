"use client";

import clsx from "clsx";
import {
  subscribeToNewsletterAction,
  type NewsletterFormState,
} from "components/newsletter/actions";
import { NEWSLETTER } from "lib/chrome";
import Link from "next/link";
import { useActionState } from "react";

const INITIAL_STATE: NewsletterFormState = { status: "idle", message: "" };

/**
 * The newsletter block above the footer (issue #11): mono heading, a single
 * email field with an ink Subscribe button, and the privacy note under it.
 * Rendered from `components/layout/footer.tsx`, so it appears on every page
 * that carries the footer.
 *
 * Feedback is inline and server-driven — the action validates the address and
 * reports both outcomes as copy, which is why the form is `noValidate`: the
 * browser's own bubble would otherwise pre-empt the message the shopper is
 * meant to read, and only one of the two can be the source of truth.
 */
export function NewsletterSignup() {
  const [state, formAction, pending] = useActionState(
    subscribeToNewsletterAction,
    INITIAL_STATE,
  );

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="border-t border-neutral-200"
    >
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5 px-6 py-16 text-center">
        <h2
          id="newsletter-heading"
          className="font-mono text-2xl tracking-[0.2em] text-brand-ink uppercase sm:text-3xl"
        >
          {NEWSLETTER.heading}
        </h2>
        <p className="max-w-md text-sm text-neutral-500">{NEWSLETTER.body}</p>

        <form
          action={formAction}
          noValidate
          className="flex w-full flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            {NEWSLETTER.emailLabel}
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={NEWSLETTER.placeholder}
            aria-invalid={state.status === "error"}
            aria-describedby="newsletter-status"
            className="min-w-0 flex-1 border border-neutral-300 bg-brand-base px-4 py-3 font-mono text-sm text-brand-ink placeholder:text-neutral-400"
          />
          <button
            type="submit"
            disabled={pending}
            className={clsx(
              "shrink-0 bg-brand-ink px-6 py-3 font-mono text-sm tracking-widest text-brand-base uppercase",
              pending
                ? "cursor-not-allowed opacity-50"
                : "transition-opacity hover:opacity-80",
            )}
          >
            {pending ? `${NEWSLETTER.submitting}…` : NEWSLETTER.submit}
          </button>
        </form>

        {/*
         * A live region that outlives any one submit, so a screen reader
         * announces each result as the text changes. It keeps its height when
         * empty so the block doesn't jump on the first message.
         */}
        <p
          id="newsletter-status"
          role="status"
          aria-live="polite"
          className={clsx(
            "min-h-5 text-sm",
            state.status === "error" && "text-red-600",
            state.status === "success" && "text-brand-ink",
          )}
        >
          {state.message}
        </p>

        <p className="text-xs text-neutral-500">
          {NEWSLETTER.privacyNote.before}
          <Link
            href={NEWSLETTER.privacyNote.href}
            prefetch={true}
            className="underline underline-offset-4 transition-colors hover:text-brand-ink"
          >
            {NEWSLETTER.privacyNote.linkLabel}
          </Link>
          {NEWSLETTER.privacyNote.after}
        </p>
      </div>
    </section>
  );
}
