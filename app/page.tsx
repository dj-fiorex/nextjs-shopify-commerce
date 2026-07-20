import { BestSellers } from "components/homepage/best-sellers";
import { DropSection } from "components/homepage/drop-section";
import { Hero } from "components/homepage/hero";
import Footer from "components/layout/footer";
import { SITE_DESCRIPTION } from "lib/brand";
import { getHomepage } from "lib/shopify";

export const metadata = {
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
  },
};

export default async function HomePage() {
  const homepage = await getHomepage();

  return (
    <>
      <Hero homepage={homepage} />
      <DropSection homepage={homepage} />
      <BestSellers homepage={homepage} />
      <Footer />
    </>
  );
}
