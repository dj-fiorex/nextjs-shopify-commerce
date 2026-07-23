import Footer from "components/layout/footer";
import ChildrenWrapper from "./children-wrapper";
import { Suspense } from "react";

/**
 * The catalog shell (issue #8). The concept's catalog is a clean grid, so the
 * template's collections sidebar and sort dropdown are gone; what stays is a
 * centered column that holds the bare product grid. Collection and search routes
 * still resolve underneath — only their surrounding chrome was removed.
 */
export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto min-h-screen w-full max-w-7xl px-6 py-8 text-black min-[1320px]:px-0">
        <Suspense fallback={null}>
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
