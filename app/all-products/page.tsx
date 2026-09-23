import fs from "fs";
import path from "path";
import { categories } from "@/lib/categories";
import AllProductsGrid from "@/components/AllProductsGrid";

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
