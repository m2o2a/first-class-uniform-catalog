"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import CategoryCard from "@/components/CategoryCard";
import SectorGrid from "@/components/SectorGrid";
import { categories } from "@/lib/categories";

export default function Home() {
  const { t, lang } = useLang();
  const featured = categories.slice(0, 8);

  return (
    <>
      <Hero />

      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow={t.sectionsPage.eyebrow}
            title={t.sectionsPage.title}
            sub={t.sectionsPage.sub}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {featured.map((c, i) => (
              <CategoryCard key={c.slug} category={c} index={i} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/sections"
              className="inline-flex items-center gap-2 rounded-full border border-ink text-ink text-sm font-semibold px-6 py-3 hover:bg-ink hover:text-white transition-colors"
            >
              {lang === "ar" ? "شوف كل الأقسام (22)" : "See all 22 sections"}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-ink fabric-texture">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading eyebrow={t.projects.eyebrow} title={t.projects.title} sub={t.projects.sub} dark />
          <SectorGrid compact />
          <div className="text-center mt-10">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full bg-white text-ink text-sm font-semibold px-6 py-3 hover:bg-mist transition-colors"
            >
              {lang === "ar" ? "شوف سابقة الأعمال" : "See previous projects"}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-paper">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink mb-4">
            {lang === "ar"
              ? "ابعت الكتالوج، خلي عميلك يشوف شغلك من موبايله"
              : "Send the catalog, let your client see the work from their phone"}
          </h2>
          <p className="text-steel text-sm sm:text-base mb-8">
            {lang === "ar"
              ? "رابط واحد، يفتح على أي جهاز، ويقود مباشرة للتواصل."
              : "One link, opens on any device, leads straight to a conversation."}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-signal text-white text-sm font-semibold px-7 py-3.5 hover:opacity-90 transition-opacity"
          >
            {t.nav.contact}
          </Link>
        </div>
      </section>
    </>
  );
}
