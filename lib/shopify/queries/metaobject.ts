import imageFragment from "../fragments/image";

// Fetches a single metaobject entry by { type, handle }. Each field is returned
// generically as `key`/`value`; `reference` resolves the file and collection
// fields to their concrete types so the caller gets a ready image URL or handle
// without a second round-trip. Requires Storefront API 2023-07+.
export const getHomepageMetaobjectQuery = /* GraphQL */ `
  query getHomepageMetaobject($handle: MetaobjectHandleInput!) {
    metaobject(handle: $handle) {
      id
      handle
      type
      fields {
        key
        value
        reference {
          __typename
          ... on MediaImage {
            image {
              ...image
            }
          }
          ... on Video {
            sources {
              url
              mimeType
            }
            previewImage {
              ...image
            }
          }
          ... on Collection {
            handle
            title
          }
        }
      }
    }
  }
  ${imageFragment}
`;
