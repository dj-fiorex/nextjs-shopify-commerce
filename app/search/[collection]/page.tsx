import { getCollection, getCollectionProducts } from "lib/shopify";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductGrid } from "components/product/product-grid";
import { defaultSort, sorting } from "lib/constants";

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description ||
      collection.description ||
      `${collection.title} products`,
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sort } = searchParams as { [key: string]: string };
  // No sort dropdown renders (issue #8), but the `sort` param still drives the
  // query so filtering can return if the catalog grows.
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;
  const collection = await getCollection(params.collection);
  const products = await getCollectionProducts({
    collection: params.collection,
    sortKey,
    reverse,
  });

  return (
    <section>
      {collection ? (
        <h1 className="mb-8 font-mono text-2xl tracking-[0.2em] text-brand-ink uppercase sm:text-3xl">
          {collection.title}
        </h1>
      ) : null}
      {products.length === 0 ? (
        <p className="font-mono text-xs tracking-widest text-neutral-500 uppercase">
          No products found in this collection
        </p>
      ) : (
        <ProductGrid products={products} />
      )}
    </section>
  );
}
