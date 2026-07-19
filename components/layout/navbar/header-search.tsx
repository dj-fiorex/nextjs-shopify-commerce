"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { iconButtonClasses } from "./icon-button";
import Search from "./search";

/**
 * The header's search entry point: an icon button that reveals the search field
 * in a dropdown. Keeping the icon on the right (rather than an always-visible
 * input) matches the concept's minimal header, while the revealed field reuses
 * the same `next/form` GET-to-`/search` flow the template already ships, so the
 * search behaviour is unchanged.
 */
export default function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dismiss on outside click or Escape so the dropdown behaves like a popover.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close search" : "Open search"}
        aria-expanded={open}
        className={iconButtonClasses}
      >
        {open ? (
          <XMarkIcon className="h-4" />
        ) : (
          <MagnifyingGlassIcon className="h-4" />
        )}
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-40 mt-2 w-screen max-w-xs rounded-lg border border-neutral-200 bg-brand-base p-3 shadow-lg">
          <Search autoFocus onSubmit={() => setOpen(false)} />
        </div>
      ) : null}
    </div>
  );
}
