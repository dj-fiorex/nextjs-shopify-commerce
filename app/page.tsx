import { Carousel } from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import Footer from "components/layout/footer";
import { SITE_DESCRIPTION } from "lib/brand";

export const metadata = {
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <ThreeItemGrid />
      <Carousel />
      <Footer />
    </>
  );
}
