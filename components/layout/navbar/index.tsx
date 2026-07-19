import CartModal from "components/cart/modal";
import Logo from "components/logo";
import { SITE_NAME } from "lib/brand";
import { getMenu } from "lib/shopify";
import Link from "next/link";
import { Suspense } from "react";
import HeaderSearch from "./header-search";
import NavDrawer from "./nav-drawer";

/**
 * The sitewide header. Layout is fixed across breakpoints (issue #4): a menu
 * trigger on the left, the centred butterfly logo linking home, and search +
 * cart on the right. The menu opens a navigation drawer fed by the store's
 * header navigation menu.
 */
export async function Navbar() {
  const menu = await getMenu("next-js-frontend-header-menu");

  return (
    <nav className="flex items-center p-4 lg:px-6">
      <div className="flex flex-1 justify-start">
        <Suspense fallback={null}>
          <NavDrawer menu={menu} />
        </Suspense>
      </div>
      <div className="flex flex-1 justify-center">
        <Link
          href="/"
          prefetch={true}
          aria-label={`${SITE_NAME} home`}
          className="flex items-center justify-center"
        >
          <Logo className="h-7" priority />
          <span className="sr-only">{SITE_NAME}</span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-end gap-2">
        <Suspense fallback={null}>
          <HeaderSearch />
        </Suspense>
        <CartModal />
      </div>
    </nav>
  );
}
