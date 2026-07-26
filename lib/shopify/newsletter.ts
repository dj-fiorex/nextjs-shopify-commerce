import { adminFetch, isAdminApiConfigured } from "./admin";
import {
  customerCreateMutation,
  customerEmailMarketingConsentUpdateMutation,
} from "./mutations/customer";
import { getCustomerByEmailQuery } from "./queries/customer";
import type {
  ShopifyCustomer,
  ShopifyCustomerByEmailOperation,
  ShopifyCustomerCreateOperation,
  ShopifyCustomerEmailMarketingConsentUpdateOperation,
  ShopifyEmailMarketingConsentInput,
  ShopifyUserError,
} from "./types";

/**
 * Newsletter signup (issue #11). Subscribers land in the store's own customer
 * list with email-marketing consent — no third-party ESP — so whichever email
 * tool the client connects later already has the audience.
 *
 * The find/create/update dance behind that lives here rather than in the server
 * action: callers hand over a raw email string and get back one outcome,
 * whether the shopper is new, already a customer, or subscribing for the second
 * time.
 */

export type NewsletterSubscribeResult =
  | { ok: true }
  | { ok: false; reason: "invalid-email" | "failed" };

// Deliberately stricter than the RFC: one @ and a dotted domain. Shopify
// validates the address for real on its side; this is about answering an
// obvious typo with a clear message instead of a round-trip.
const EMAIL_PATTERN =
  /^[^\s@,;:"'<>()[\]\\]+@[^\s@,;:"'<>()[\]\\.]+(?:\.[^\s@,;:"'<>()[\]\\.]+)+$/;

// RFC 5321's practical ceiling for an address.
const MAX_EMAIL_LENGTH = 254;

function marketingConsent(): ShopifyEmailMarketingConsentInput {
  return {
    marketingState: "SUBSCRIBED",
    // Single opt-in: the shopper's submit is the consent. Double opt-in would
    // need a confirmation email, which is the ESP decision this build defers.
    marketingOptInLevel: "SINGLE_OPT_IN",
    // Shopify rejects a future timestamp, so this is the submit's own moment.
    consentUpdatedAt: new Date().toISOString(),
  };
}

async function findCustomerByEmail(
  email: string,
): Promise<ShopifyCustomer | undefined> {
  const data = await adminFetch<ShopifyCustomerByEmailOperation>({
    query: getCustomerByEmailQuery,
    variables: { identifier: { emailAddress: email } },
  });

  return data.customerByIdentifier ?? undefined;
}

function formatUserErrors(userErrors: ShopifyUserError[]): string {
  return userErrors.map((error) => error.message).join("; ");
}

// Shopify reports a duplicate as a validation error on `email` ("Email has
// already been taken"); this payload carries no error code to match instead.
function isEmailTaken(userErrors: ShopifyUserError[]): boolean {
  return userErrors.some(
    (error) =>
      error.field?.includes("email") && /taken|already/i.test(error.message),
  );
}

/**
 * Puts consent on a customer the store already has. Skips the write when they
 * are subscribed already, which is the common case for a repeat submit.
 */
async function subscribeExistingCustomer(
  customer: ShopifyCustomer,
): Promise<NewsletterSubscribeResult> {
  if (customer.emailMarketingConsent?.marketingState === "SUBSCRIBED") {
    return { ok: true };
  }

  const data =
    await adminFetch<ShopifyCustomerEmailMarketingConsentUpdateOperation>({
      query: customerEmailMarketingConsentUpdateMutation,
      variables: {
        input: {
          customerId: customer.id,
          emailMarketingConsent: marketingConsent(),
        },
      },
    });

  const { customer: updated, userErrors } =
    data.customerEmailMarketingConsentUpdate;

  if (userErrors.length || !updated) {
    console.error(
      `Newsletter consent update rejected by Shopify: ${formatUserErrors(userErrors)}`,
    );
    return { ok: false, reason: "failed" };
  }

  return { ok: true };
}

/**
 * Subscribes `rawEmail` to the newsletter, creating the Shopify customer when
 * the store doesn't have one yet. Never throws: infrastructure failures are
 * logged server-side and returned as `failed` so the form can speak to the
 * shopper in its own words.
 */
export async function subscribeToNewsletter(
  rawEmail: string,
): Promise<NewsletterSubscribeResult> {
  const email = rawEmail.trim().toLowerCase();

  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { ok: false, reason: "invalid-email" };
  }

  if (!isAdminApiConfigured()) {
    console.error(
      "Newsletter signup is unavailable: the Shopify Admin API is not configured. " +
        "Set SHOPIFY_ADMIN_ACCESS_TOKEN, or SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET " +
        "for an app installed with the read_customers and write_customers scopes.",
    );
    return { ok: false, reason: "failed" };
  }

  try {
    // Look first: a shopper who has ordered before, or subscribed before, keeps
    // their one customer record and just gains (or re-confirms) consent.
    const existing = await findCustomerByEmail(email);

    if (existing) {
      return await subscribeExistingCustomer(existing);
    }

    const data = await adminFetch<ShopifyCustomerCreateOperation>({
      query: customerCreateMutation,
      variables: {
        input: { email, emailMarketingConsent: marketingConsent() },
      },
    });

    const { customer, userErrors } = data.customerCreate;

    if (customer) {
      return { ok: true };
    }

    if (isEmailTaken(userErrors)) {
      // Between the lookup and the create, something else claimed the address —
      // a second submit racing this one. Whoever won holds the record, so
      // subscribe against theirs (usually a no-op: they set consent too).
      const raced = await findCustomerByEmail(email);

      if (raced) {
        return await subscribeExistingCustomer(raced);
      }

      // Taken, yet no customer answers to it: a record this app can't read,
      // such as a redacted one. Nothing here can attach consent to it, so don't
      // tell the shopper they're on the list.
      console.error(
        `Newsletter signup: Shopify reports ${email} is taken, but no customer answers to that address.`,
      );
      return { ok: false, reason: "failed" };
    }

    console.error(
      `Newsletter signup rejected by Shopify: ${formatUserErrors(userErrors)}`,
    );
    return { ok: false, reason: "failed" };
  } catch (e) {
    console.error("Newsletter signup failed:", e);
    return { ok: false, reason: "failed" };
  }
}
