"use client";

import { useLang } from "@/lib/lang-context";
import SectionHeading from "@/components/SectionHeading";
import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/lib/categories";

export default function SectionsPage() {
  const { t } = useLang();

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t.sectionsPage.eyebrow}
          title={t.sectionsPage.title}
          sub={t.sectionsPage.sub}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((c, i) => (
            <CategoryCard key={c.slug} category={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
