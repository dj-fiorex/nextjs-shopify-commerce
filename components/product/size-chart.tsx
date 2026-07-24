"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Image as ImageType } from "lib/shopify/types";
import Image from "next/image";
import { Fragment, useState } from "react";

/**
 * The PDP's Size Chart affordance (issue #10): a mono text button that opens
 * the product's chart image in a centered modal. The caller renders it only
 * when the product has a chart, so absence costs no layout.
 */
export function SizeChart({ image }: { image: ImageType }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="font-mono text-xs tracking-widest text-brand-ink uppercase underline underline-offset-4 transition-colors hover:text-neutral-500"
      >
        Size Chart
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="flex max-h-[85vh] w-full max-w-lg flex-col border border-neutral-200 bg-brand-base p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Dialog.Title className="font-mono text-xs tracking-widest text-brand-ink uppercase">
                    Size Chart
                  </Dialog.Title>
                  <button
                    aria-label="Close size chart"
                    onClick={() => setIsOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6 text-brand-ink transition-colors hover:text-neutral-500" />
                  </button>
                </div>
                <div className="overflow-y-auto">
                  <Image
                    src={image.url}
                    alt={image.altText}
                    width={image.width}
                    height={image.height}
                    sizes="(min-width: 640px) 32rem, 100vw"
                    className="h-auto w-full"
                  />
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
