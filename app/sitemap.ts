import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/sections", "/all-products", "/design", "/quote", "/guide", "/news", "/projects", "/clients", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${SITE}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...categories.map((c) => ({
      url: `${SITE}/sections/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      images: [`${SITE}/products/${c.slug}/1.jpg`]
    }))
  ];
}
