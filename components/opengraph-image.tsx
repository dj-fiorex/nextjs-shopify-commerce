import { readFile } from "fs/promises";
import { LOGO, SITE_NAME } from "lib/brand";
import { ImageResponse } from "next/og";
import { join } from "path";

export type Props = {
  title?: string;
};

export default async function OpengraphImage(
  props?: Props,
): Promise<ImageResponse> {
  // Callers may pass `{ title: undefined }` for an untitled collection, so
  // fall back to the site name rather than rendering (or upper-casing) nothing.
  const title = props?.title || SITE_NAME;

  const [fontFile, logoFile] = await Promise.all([
    readFile(join(process.cwd(), "./fonts/Inter-Bold.ttf")),
    readFile(join(process.cwd(), "public", LOGO.path)),
  ]);
  const font = Uint8Array.from(fontFile).buffer;
  // Satori has no access to /public over HTTP, so the mark is inlined.
  const logo = `data:image/png;base64,${logoFile.toString("base64")}`;

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col items-center justify-center bg-white">
        <img src={logo} width="440" height="300" alt="" />
        <p tw="mt-10 text-6xl font-bold tracking-widest text-black">
          {title.toUpperCase()}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: font,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
