import clsx from "clsx";
import { LOGO, SITE_NAME } from "lib/brand";
import Image from "next/image";

/**
 * The CrazySociety butterfly mark. Black ink on transparency, so it is only
 * ever placed on the brand's white base.
 */
export default function Logo({
  className,
  priority,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={LOGO.path}
      alt={`${SITE_NAME} logo`}
      width={LOGO.width}
      height={LOGO.height}
      priority={priority}
      className={clsx("w-auto", className)}
    />
  );
}
