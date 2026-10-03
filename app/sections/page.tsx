"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/lib/lang-context";
import PageBanner from "@/components/PageBanner";
import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/lib/categories";

export default function SectionsPage() {
  const { t, lang } = useLang();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((c) =>
      [c.ar, c.en, c.descAr, c.descEn].some((s) => s.toLowerCase().includes(query))
    );
  }, [q]);

  return (
    <>
      <PageBanner eyebrow={t.sectionsPage.eyebrow} title={t.sectionsPage.title} sub={t.sectionsPage.sub} />

      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 max-w-md">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={lang === "ar" ? "دور على قسم (أمن، مطاعم، مصانع...)" : "Search sections..."}
              className="w-full rounded-full border border-line px-5 py-3 text-sm text-ink focus:border-royal focus:outline-none"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="text-steel text-sm">
              {lang === "ar" ? "مفيش قسم مطابق للبحث." : "No matching sections."}
            </p>
          ) : (
            <>
              {[
                { title: lang === "ar" ? "المجالات" : "Sectors", sub: lang === "ar" ? "اختار مجال شغلك" : "Pick your industry", list: filtered.filter((c) => c.kind !== "product") },
                { title: lang === "ar" ? "الأصناف" : "Products", sub: lang === "ar" ? "اختار نوع القطعة" : "Pick a garment type", list: filtered.filter((c) => c.kind === "product") }
              ]
                .filter((g) => g.list.length)
                .map((g) => (
                  <div key={g.title} className="mb-14">
                    <div className="flex items-end justify-between mb-5 border-b border-line pb-3">
                      <h2 className="font-display font-bold text-2xl text-ink">{g.title}</h2>
                      <p className="text-steel text-sm">{g.sub} · {g.list.length}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
                      {g.list.map((c, i) => (
                        <CategoryCard key={c.slug} category={c} index={i} />
                      ))}
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </section>
    </>
  );
}
