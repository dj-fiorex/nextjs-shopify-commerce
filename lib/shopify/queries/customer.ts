// Admin API. Looks a subscriber up before creating one, so a repeat signup
// updates the existing customer instead of colliding on their email.
//
// An exact lookup by address rather than `customers(query: "email:…")`: that one
// runs through Shopify's search index, which tokenises the address and lags
// behind writes, so it can miss the very customer a repeat submit is about.
export const getCustomerByEmailQuery = /* GraphQL */ `
  query getCustomerByEmail($identifier: CustomerIdentifierInput!) {
    customerByIdentifier(identifier: $identifier) {
      id
      email
      emailMarketingConsent {
        marketingState
      }
    }
  }
`;
