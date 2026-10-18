"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { productsInSection } from "@/lib/products";

export default function SectionProducts({ section }: { section: string }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const list = productsInSection(section);
  if (!list.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-10">
      <h2 className="text-xl font-black text-ink mb-4">{ar ? "🧵 منتجاتنا في القسم ده" : "🧵 Our products in this category"}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <Link key={p.slug} href={`/product/${p.slug}`} className="block rounded-2xl border border-line bg-white p-5 hover:border-royal hover:shadow-lg transition">
            <p className="font-black text-ink text-lg">{ar ? p.ar : p.en}</p>
            <p className="text-steel text-sm mt-2 line-clamp-3">{ar ? p.descAr : p.descEn}</p>
            <p className="text-royal text-sm font-bold mt-3">{ar ? "التفاصيل والمقاسات ←" : "Details & sizes →"}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
