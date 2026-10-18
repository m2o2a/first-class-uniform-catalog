import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products, getProduct } from "@/lib/products";
import ProductDetail from "@/components/ProductDetail";
import { BRAND_AR, pageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProduct(params.slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.ar} | ${BRAND_AR}`,
    absoluteTitle: true,
    description: p.descAr,
    path: `/product/${p.slug}`,
    image: `/products/${p.section}/1.jpg`
  });
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

function countPhotos(section: string) {
  try {
    return fs.readdirSync(path.join(process.cwd(), "public", "products", section)).filter((f) => /^\d+\.jpg$/.test(f)).length;
  } catch {
    return 0;
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();
  return <ProductDetail product={product} photoCount={Math.max(2, countPhotos(product.section))} />;
}
