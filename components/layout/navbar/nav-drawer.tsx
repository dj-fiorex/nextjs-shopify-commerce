"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Menu } from "lib/shopify/types";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { iconButtonClasses } from "./icon-button";

/**
 * The navigation drawer. Unlike the template's original mobile-only menu, the
 * trigger and drawer show on every breakpoint (issue #4: "Menu opens a
 * navigation drawer on both mobile and desktop"). Links are fed by the store's
 * header navigation menu, so merchandising stays in Shopify.
 */
export default function NavDrawer({ menu }: { menu: Menu[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  // Close the drawer whenever navigation happens (link click, search submit).
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        onClick={openDrawer}
        aria-label="Open navigation menu"
        className={iconButtonClasses}
      >
        <Bars3Icon className="h-4" />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeDrawer} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 top-0 flex h-full w-4/5 max-w-sm flex-col bg-brand-base p-6">
              <button
                className={clsx(iconButtonClasses, "mb-8")}
                onClick={closeDrawer}
                aria-label="Close navigation menu"
              >
                <XMarkIcon className="h-6" />
              </button>

              {menu.length ? (
                <nav>
                  <ul className="flex w-full flex-col gap-1">
                    {menu.map((item: Menu) => (
                      <li key={item.title}>
                        <Link
                          href={item.path}
                          prefetch={true}
                          onClick={closeDrawer}
                          className="block py-2 font-mono text-2xl tracking-wide text-brand-ink uppercase underline-offset-4 transition-colors hover:underline"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
