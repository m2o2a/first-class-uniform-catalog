import fs from "fs";
import path from "path";
import { categories } from "@/lib/categories";
import AllProductsGrid from "@/components/AllProductsGrid";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "كل منتجات اليونيفورم",
  description:
    "كل صور منتجات فرست كلاس لليونيفورم في صفحة واحدة، مقسمة حسب القطاع والصنف — اختار الموديل، خصّص اللون واللوجو، واطلب عرض سعر أو عينة.",
  path: "/all-products"
});

function listPhotos(slug: string) {
  const dir = path.join(process.cwd(), "public", "products", slug);
  try {
    const files = fs
      .readdirSync(dir)
      .filter((f) => /^\d+\.jpg$/.test(f))
      .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    return files.map((f) => `/products/${slug}/${f}`);
  } catch {
    return [];
  }
}

export default function AllProductsPage() {
  const data = categories
    .map((c) => ({ category: c, photos: listPhotos(c.slug) }))
    .filter((d) => d.photos.length > 0);

  return <AllProductsGrid data={data} />;
}
