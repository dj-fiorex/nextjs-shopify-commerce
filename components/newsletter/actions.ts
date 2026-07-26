"use server";

import { NEWSLETTER } from "lib/chrome";
import { subscribeToNewsletter } from "lib/shopify/newsletter";

/**
 * What the newsletter form renders under its input. `idle` is the untouched
 * state; the message is already shopper-facing copy, so the component only has
 * to place it.
 */
export type NewsletterFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

/**
 * Subscribes the submitted address (issue #11). A repeat submit of an address
 * the store already has is a success, not a duplicate-customer error — the
 * shopper only ever learns whether they are on the list.
 *
 * Deliberately says nothing about whether the address was already subscribed,
 * so the form can't be used to enumerate the store's customers.
 */
export async function subscribeToNewsletterAction(
  _prevState: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  const email = formData.get("email");
  const result = await subscribeToNewsletter(
    typeof email === "string" ? email : "",
  );

  if (result.ok) {
    return { status: "success", message: NEWSLETTER.success };
  }

  return {
    status: "error",
    message:
      result.reason === "invalid-email"
        ? NEWSLETTER.errors.invalidEmail
        : NEWSLETTER.errors.failed,
  };
}
