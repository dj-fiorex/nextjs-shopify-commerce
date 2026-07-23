"use client";

import clsx from "clsx";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * The PDP gallery (issue #9): one large product photo with a row of square
 * thumbnails beneath it that swap the main image. The selected index lives in
 * the `?image=` search param so a specific view stays linkable and survives
 * variant changes, which use sibling params on the same URL.
 *
 * The photo sits on the same neutral ground as the grid cards but is contained
 * rather than cropped — a shopper inspecting a garment needs the full frame.
 */
export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageIndex = searchParams.has("image")
    ? parseInt(searchParams.get("image")!)
    : 0;

  const updateImage = (index: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("image", index);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <form>
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        {images[imageIndex] && (
          <Image
            className="h-full w-full object-contain"
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            alt={images[imageIndex]?.altText as string}
            src={images[imageIndex]?.src as string}
            priority={true}
          />
        )}
      </div>

      {images.length > 1 ? (
        <ul className="mt-4 flex gap-2 overflow-x-auto py-1">
          {images.map((image, index) => {
            const isActive = index === imageIndex;

            return (
              <li key={image.src} className="h-20 w-20 shrink-0">
                <button
                  formAction={() => updateImage(index.toString())}
                  aria-label={`View image ${index + 1} of ${images.length}`}
                  aria-current={isActive}
                  className={clsx(
                    "relative h-full w-full border bg-neutral-100 transition-colors",
                    isActive
                      ? "border-brand-ink"
                      : "border-transparent hover:border-neutral-400",
                  )}
                >
                  <Image
                    className="object-contain"
                    fill
                    sizes="80px"
                    alt={image.altText}
                    src={image.src}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </form>
  );
}
