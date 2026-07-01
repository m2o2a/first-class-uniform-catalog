"use client";

import { useLang } from "@/lib/lang-context";
import { whatsappLink, telLink, phones } from "@/lib/contact";
import { Category } from "@/lib/categories";
import WatermarkImage from "@/components/WatermarkImage";

export default function CategoryDetail({ category }: { category: Category }) {
  const { t, lang } = useLang();
  const name = lang === "ar" ? category.ar : category.en;
  const desc = lang === "ar" ? category.descAr : category.descEn;

  const placeholders = Array.from({ length: 8 });

  return (
    <>
      {/* Banner */}
      <section className="relative h-[46vh] min-h-[320px] flex items-end bg-ink fabric-texture overflow-hidden">
        <div className="pointer-events-none absolute -top-32 start-1/3 w-[50vw] h-[50vw] rounded-full bg-royal/25 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 pb-10 w-full">
          <p className="text-signal text-xs tracking-widest2 font-bold mb-2">
            FIRST CLASS FOR UNIFORM
          </p>
          <h1 className="font-display font-bold text-white text-3xl sm:text-5xl">{name}</h1>
          <p className="text-mist mt-2 max-w-lg">{desc}</p>
        </div>
      </section>

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
                alt={`${name} ${i + 1}`}
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
