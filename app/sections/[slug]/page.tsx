import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/categories";
import CategoryDetail from "@/components/CategoryDetail";

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
  return <CategoryDetail category={category} photoCount={photoCount} />;
}
