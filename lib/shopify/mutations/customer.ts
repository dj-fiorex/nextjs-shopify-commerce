// Admin API. Newsletter signup writes marketing consent two ways: on the
// customer it creates, or onto a customer who already exists (issue #11).
//
// Only `field`/`message` are selected from `userErrors` — the two payloads use
// different error types, and those are the fields both of them share.
export const customerCreateMutation = /* GraphQL */ `
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        emailMarketingConsent {
          marketingState
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const customerEmailMarketingConsentUpdateMutation = /* GraphQL */ `
  mutation customerEmailMarketingConsentUpdate(
    $input: CustomerEmailMarketingConsentUpdateInput!
  ) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer {
        id
        email
        emailMarketingConsent {
          marketingState
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;
