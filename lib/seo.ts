import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const BRAND_AR = "فرست كلاس لليونيفورم";

// Per-page metadata: its own title, description, canonical and Open Graph URL.
// Child metadata replaces the parent's openGraph object entirely, so every
// page builds a complete one here instead of relying on the root layout.
export function pageMetadata({
  title,
  description,
  path,
  image = "/logo/logo.png",
  absoluteTitle = false
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  absoluteTitle?: boolean;
}): Metadata {
  const url = `${SITE}${path === "/" ? "" : path}`;
  const fullTitle = absoluteTitle ? title : `${title} | ${BRAND_AR}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ar_EG",
      siteName: BRAND_AR,
      title: fullTitle,
      description,
      url,
      images: [image]
    }
  };
}
