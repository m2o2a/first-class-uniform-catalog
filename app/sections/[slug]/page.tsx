import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/categories";
import CategoryDetail from "@/components/CategoryDetail";
import { getDetail } from "@/lib/category-details";
import type { Metadata } from "next";

import { SITE } from "@/lib/site";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getCategory(params.slug);
  if (!c) return {};
  const d = getDetail(c.slug);
  const title = `${c.ar} | فرست كلاس لليونيفورم`;
  const description = d?.about || c.descAr;
  const image = `${SITE}/products/${c.slug}/1.jpg`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE}/sections/${c.slug}` },
    openGraph: { title, description, url: `${SITE}/sections/${c.slug}`, images: [image], locale: "ar_EG", type: "website" }
  };
}

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

function countPhotos(slug: string) {
  const dir = path.join(process.cwd(), "public", "products", slug);
  try {
    const files = fs.readdirSync(dir).filter((f) => /^\d+\.jpg$/.test(f));
    const max = files.reduce((m, f) => Math.max(m, parseInt(f, 10)), 0);
    // always show at least 8 slots, never more than the highest numbered photo present
    return Math.max(8, max);
  } catch {
    return 8;
  }
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) notFound();
  const photoCount = countPhotos(category.slug);
  return <CategoryDetail category={category} photoCount={photoCount} detail={getDetail(category.slug)} />;
}
