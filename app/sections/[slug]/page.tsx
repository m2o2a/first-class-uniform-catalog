import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/categories";
import CategoryDetail from "@/components/CategoryDetail";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) notFound();
  return <CategoryDetail category={category} />;
}
