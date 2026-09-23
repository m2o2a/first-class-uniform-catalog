"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import WatermarkImage from "@/components/WatermarkImage";
import { Category } from "@/lib/categories";

export default function AllProductsGrid({
  data
}: {
  data: { category: Category; photos: string[] }[];
}) {
  const { lang } = useLang();
  const totalPhotos = data.reduce((sum, d) => sum + d.photos.length, 0);

  return (
    <>
      <section className="relative py-14 sm:py-20 bg-ink fabric-texture overflow-hidden">
        <div className="pointer-events-none absolute -top-32 start-1/3 w-[50vw] h-[50vw] rounded-full bg-royal/25 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-signal text-xs tracking-widest2 font-bold mb-2">
            FIRST CLASS FOR UNIFORM
          </p>
          <h1 className="font-display font-bold text-white text-3xl sm:text-5xl">
            {lang === "ar" ? "كل المنتجات" : "All Products"}
          </h1>
          <p className="text-mist mt-2 max-w-lg">
            {lang === "ar"
              ? `${totalPhotos} صورة عبر ${data.length} قسم`
              : `${totalPhotos} photos across ${data.length} categories`}
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 space-y-16">
          {data.map(({ category, photos }) => {
            const name = lang === "ar" ? category.ar : category.en;
            return (
              <div key={category.slug}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-xl text-ink">{name}</h2>
                  <Link
                    href={`/sections/${category.slug}`}
                    className="text-signal text-sm font-bold hover:underline"
                  >
                    {lang === "ar" ? "عرض القسم" : "View section"}
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {photos.map((src, i) => (
                    <WatermarkImage
                      key={src}
                      src={src}
                      alt={`${name} ${i + 1}`}
                      fallbackLabel={name}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
