import { siteConfig } from "lib/site-config.mjs";
import imageFragment from "./image";
import seoFragment from "./seo";

// Metafield coordinates (namespace/key) are interpolated into the query text
// because GraphQL fragments cannot take variables.
const sizeChartMetafield = siteConfig.metafields.sizeChart;

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    sizeChart: metafield(namespace: "${sizeChartMetafield.namespace}", key: "${sizeChartMetafield.key}") {
      reference {
        ... on MediaImage {
          image {
            ...image
          }
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;
