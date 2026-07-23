import { ProductGrid } from "components/product/product-grid";
import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/shopify";

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  // The sort dropdown is gone (issue #8), but the `sort` param still drives the
  // query so a header search or a linked-in sort keeps working as the catalog grows.
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText = products.length > 1 ? "results" : "result";

  return (
    <>
      {searchValue ? (
        <p className="mb-8 font-mono text-xs tracking-widest text-neutral-500 uppercase">
          {products.length === 0
            ? "No products match "
            : `${products.length} ${resultsText} for `}
          <span className="text-brand-ink">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? <ProductGrid products={products} /> : null}
    </>
  );
}
