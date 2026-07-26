export type Maybe<T> = T | null;

/**
 * The variables of an operation type below, for the two GraphQL clients
 * (`index.ts` over the Storefront API, `admin.ts` over the Admin API) to derive
 * their `variables` parameter from the operation they're handed.
 */
export type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type Cart = Omit<ShopifyCart, "lines"> & {
  lines: CartItem[];
};

export type CartProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: Image;
};

export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: CartProduct;
  };
};

export type Collection = ShopifyCollection & {
  path: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type Menu = {
  title: string;
  path: string;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type Product = Omit<
  ShopifyProduct,
  "variants" | "images" | "sizeChart"
> & {
  variants: ProductVariant[];
  images: Image[];
  /** The size-chart metafield image; absent when the product has no chart. */
  sizeChart?: Image;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
};

export type SEO = {
  title: string;
  description: string;
};

export type ShopifyCart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<CartItem>;
  totalQuantity: number;
};

export type ShopifyCollection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  /**
   * The size-chart file metafield (see `siteConfig.metafields.sizeChart`).
   * `image` is only present when the reference resolved to a MediaImage.
   */
  sizeChart: {
    reference: { image?: Image | null } | null;
  } | null;
  seo: SEO;
  tags: string[];
  updatedAt: string;
};

export type ShopifyCartOperation = {
  data: {
    cart: ShopifyCart;
  };
  variables: {
    cartId: string;
  };
};

export type ShopifyCreateCartOperation = {
  data: { cartCreate: { cart: ShopifyCart } };
};

export type ShopifyAddToCartOperation = {
  data: {
    cartLinesAdd: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyRemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};

export type ShopifyUpdateCartOperation = {
  data: {
    cartLinesUpdate: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      id: string;
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyCollectionOperation = {
  data: {
    collection: ShopifyCollection;
  };
  variables: {
    handle: string;
  };
};

export type ShopifyCollectionProductsOperation = {
  data: {
    collection: {
      products: Connection<ShopifyProduct>;
    };
  };
  variables: {
    handle: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type ShopifyCollectionsOperation = {
  data: {
    collections: Connection<ShopifyCollection>;
  };
};

export type ShopifyMenuOperation = {
  data: {
    menu?: {
      items: {
        title: string;
        url: string;
      }[];
    };
  };
  variables: {
    handle: string;
  };
};

export type ShopifyPageOperation = {
  data: { pageByHandle: Page };
  variables: { handle: string };
};

export type ShopifyPagesOperation = {
  data: {
    pages: Connection<Page>;
  };
};

export type ShopifyProductOperation = {
  data: { product: ShopifyProduct };
  variables: {
    handle: string;
  };
};

export type ShopifyProductRecommendationsOperation = {
  data: {
    productRecommendations: ShopifyProduct[];
  };
  variables: {
    productId: string;
  };
};

export type ShopifyProductsOperation = {
  data: {
    products: Connection<ShopifyProduct>;
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

// --- Homepage metaobject ---------------------------------------------------

/** A resolved reference on a metaobject field (file, video, or collection). */
export type ShopifyMetaobjectReference = {
  __typename: string;
  image?: Image; // MediaImage
  sources?: { url: string; mimeType: string }[]; // Video
  previewImage?: Image; // Video
  handle?: string; // Collection
  title?: string; // Collection
};

export type ShopifyMetaobjectField = {
  key: string;
  value: string | null;
  reference: ShopifyMetaobjectReference | null;
};

export type ShopifyMetaobject = {
  id: string;
  handle: string;
  type: string;
  fields: ShopifyMetaobjectField[];
} | null;

export type ShopifyHomepageOperation = {
  data: { metaobject: ShopifyMetaobject };
  variables: { handle: { type: string; handle: string } };
};

/** A collection referenced from the homepage entry. */
export type HomepageCollectionRef = {
  handle: string;
  title: string;
  /** Storefront route, e.g. `/search/summer-drop`. */
  path: string;
};

export type HomepageVideo = {
  url: string;
  mimeType: string;
  previewImage?: Image;
};

/**
 * The homepage content model, reshaped from the `homepage` metaobject. Mirrors
 * the definition the seed writes; every field is optional so the storefront can
 * fall back gracefully when the entry (or a field) is empty or unseeded.
 */
export type Homepage = {
  heroImage?: Image;
  dropTitle?: string;
  dropCollection?: HomepageCollectionRef;
  lookbookImage?: Image;
  promoVideo?: HomepageVideo;
  bestSellersCollection?: HomepageCollectionRef;
  lifestyleImage?: Image;
  aboutHeading?: string;
  aboutBody?: string;
  announcement?: string[];
};

// --- Customers (Admin API) -------------------------------------------------
//
// Only the newsletter signup touches these; every other Shopify type above is
// read from the Storefront API.

/** The shared shape of a mutation's `userErrors` entry. */
export type ShopifyUserError = {
  field: string[] | null;
  message: string;
};

export type ShopifyCustomerMarketingState =
  | "SUBSCRIBED"
  | "NOT_SUBSCRIBED"
  | "PENDING"
  | "UNSUBSCRIBED"
  | "REDACTED"
  | "INVALID";

export type ShopifyCustomer = {
  id: string;
  email: string | null;
  emailMarketingConsent: {
    marketingState: ShopifyCustomerMarketingState;
  } | null;
};

export type ShopifyCustomerByEmailOperation = {
  data: {
    customerByIdentifier: ShopifyCustomer | null;
  };
  variables: { identifier: { emailAddress: string } };
};

export type ShopifyEmailMarketingConsentInput = {
  marketingState: "SUBSCRIBED";
  marketingOptInLevel: "SINGLE_OPT_IN";
  consentUpdatedAt: string;
};

export type ShopifyCustomerCreateOperation = {
  data: {
    customerCreate: {
      customer: ShopifyCustomer | null;
      userErrors: ShopifyUserError[];
    };
  };
  variables: {
    input: {
      email: string;
      emailMarketingConsent: ShopifyEmailMarketingConsentInput;
    };
  };
};

export type ShopifyCustomerEmailMarketingConsentUpdateOperation = {
  data: {
    customerEmailMarketingConsentUpdate: {
      customer: ShopifyCustomer | null;
      userErrors: ShopifyUserError[];
    };
  };
  variables: {
    input: {
      customerId: string;
      emailMarketingConsent: ShopifyEmailMarketingConsentInput;
    };
  };
};
