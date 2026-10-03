"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { whatsappLink, telLink, phones } from "@/lib/contact";
import { Category, categories } from "@/lib/categories";
import type { CategoryDetail as Detail } from "@/lib/category-details";
import WatermarkImage from "@/components/WatermarkImage";

export default function CategoryDetail({
  category,
  photoCount = 8,
  detail
}: {
  category: Category;
  photoCount?: number;
  detail?: Detail;
}) {
  const { t, lang } = useLang();
  const name = lang === "ar" ? category.ar : category.en;
  const desc = lang === "ar" ? category.descAr : category.descEn;

  const placeholders = Array.from({ length: photoCount });

  return (
    <>
      {/* Banner */}
      <section className="relative h-[46vh] min-h-[320px] flex items-end bg-ink fabric-texture overflow-hidden">
        <div className="pointer-events-none absolute -top-32 start-1/3 w-[50vw] h-[50vw] rounded-full bg-royal/25 blur-[120px]" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 pb-10 w-full"
        >
          <p className="text-signal text-xs tracking-widest2 font-bold mb-2">
            FIRST CLASS FOR UNIFORM
          </p>
          <h1 className="font-display font-bold text-white text-3xl sm:text-5xl">{name}</h1>
          <p className="text-mist mt-2 max-w-lg">{desc}</p>
          <Link
            href={`/quote?model=${category.slug}`}
            className="inline-flex items-center gap-2 mt-5 rounded-full bg-gold text-ink text-sm font-bold px-6 py-3 hover:opacity-90"
          >
            {lang === "ar" ? "احسب سعر " + name : "Get a quote for " + name}
          </Link>
        </motion.div>
      </section>

      {detail && (
        <section className="py-12 sm:py-16 bg-paper border-b border-line">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <p className="text-ink leading-8 text-base sm:text-lg">{detail.about}</p>
              <h2 className="font-display font-bold text-ink text-lg mt-8 mb-4">
                {lang === "ar" ? `إيه اللي بيميّز ${name} عندنا؟` : `What makes our ${name} different?`}
              </h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {detail.features.map((f) => (
                  <li key={f} className="flex gap-3 rounded-xl bg-white border border-line p-4 text-sm text-ink">
                    <span className="text-gold">✦</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <aside className="space-y-4">
              <div className="rounded-2xl bg-ink text-white p-5">
                <p className="text-gold text-xs font-bold mb-2">{lang === "ar" ? "الخامة اللي بننصح بيها" : "Recommended fabric"}</p>
                <p className="text-sm leading-7">{detail.fabric}</p>
              </div>
              {detail.items.length > 0 && (
                <div className="rounded-2xl bg-white border border-line p-5">
                  <p className="text-steel text-xs font-bold mb-3">{lang === "ar" ? "أصناف مناسبة" : "Suitable products"}</p>
                  <div className="flex flex-wrap gap-2">
                    {detail.items.map((s) => {
                      const c = categories.find((x) => x.slug === s);
                      return c ? (
                        <Link key={s} href={`/sections/${s}`} className="rounded-full border border-royal text-royal text-xs font-semibold px-3 py-1.5 hover:bg-royal hover:text-white">
                          {lang === "ar" ? c.ar : c.en}
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
              <ShareLink slug={category.slug} name={name} ar={lang === "ar"} />
            </aside>
          </div>
        </section>
      )}

      {/* Gallery */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl text-ink">{t.categoryPage.gallery}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {placeholders.map((_, i) => (
              <WatermarkImage
                key={i}
                src={`/products/${category.slug}/${i + 1}.jpg`}
                alt={`${name} - تصنيع فرست كلاس لليونيفورم بتطريز اللوجو - موديل ${i + 1}`}
                fallbackLabel={name}
              />
            ))}
          </div>
          <p className="text-steel text-xs mt-6 max-w-lg">{t.categoryPage.placeholderNote}</p>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-12 bg-paper border-t border-line">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 flex flex-wrap items-center justify-between gap-5">
          <p className="font-display font-bold text-ink text-lg">
            {lang === "ar" ? `مهتم بـ ${name}؟` : `Interested in ${name}?`}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappLink(
                lang === "ar"
                  ? `مرحبًا، حابب أطلب عرض سعر لـ ${category.ar}`
                  : `Hi, I'd like a quote for ${category.en}`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366] text-white text-sm font-semibold px-6 py-3 hover:opacity-90 transition-opacity"
            >
              {t.categoryPage.whatsapp}
            </a>
            <a
              href={telLink(phones[0])}
              className="rounded-full border border-ink text-ink text-sm font-semibold px-6 py-3 hover:bg-ink hover:text-white transition-colors"
            >
              {t.categoryPage.call}
            </a>
            <a
              href={whatsappLink(
                lang === "ar"
                  ? `طلب عرض سعر: ${category.ar}`
                  : `Quote request: ${category.en}`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-royal text-white text-sm font-semibold px-6 py-3 hover:opacity-90 transition-opacity"
            >
              {t.categoryPage.requestQuote}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function ShareLink({ slug, name, ar }: { slug: string; name: string; ar: boolean }) {
  const url = `https://first-class-uniform-catalog.vercel.app/sections/${slug}`;
  const copy = () => {
    try {
      navigator.clipboard.writeText(url);
      alert(ar ? "اتنسخ اللينك ✓" : "Link copied ✓");
    } catch {}
  };
  return (
    <div className="rounded-2xl bg-white border border-line p-5">
      <p className="text-steel text-xs font-bold mb-3">{ar ? "لينك الصفحة دي" : "Link to this page"}</p>
      <div className="flex gap-2">
        <button onClick={copy} className="flex-1 rounded-full border border-ink text-ink text-xs font-bold py-2.5 hover:bg-ink hover:text-white">
          {ar ? "انسخ اللينك" : "Copy link"}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(name + " — " + url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center rounded-full bg-[#25D366] text-white text-xs font-bold py-2.5"
        >
          {ar ? "ابعته واتساب" : "Share"}
        </a>
      </div>
    </div>
  );
}
