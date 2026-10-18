"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { whatsappLink, telLink, phones } from "@/lib/contact";
import { getCategory } from "@/lib/categories";
import { Product, productsInSection, sizeTables, sizeTipsAr, sizeTipsEn } from "@/lib/products";
import WatermarkImage from "@/components/WatermarkImage";

export default function ProductDetail({ product, photoCount = 4 }: { product: Product; photoCount?: number }) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const name = ar ? product.ar : product.en;
  const desc = ar ? product.descAr : product.descEn;
  const colors = ar ? product.colorsAr : product.colorsEn;
  const section = getCategory(product.section);
  const related = productsInSection(product.section).filter((p) => p.slug !== product.slug);
  const msg = ar ? `أهلاً، شفت «${product.ar}» على الموقع وعايز عرض سعر` : `Hi, I saw "${product.en}" on your website and would like a quote`;
  const photos = Array.from({ length: Math.min(photoCount, 4) });

  return (
    <>
      <section className="relative py-14 sm:py-16 bg-ink fabric-texture overflow-hidden">
        <div className="pointer-events-none absolute -top-32 start-1/3 w-[50vw] h-[50vw] rounded-full bg-royal/25 blur-[120px]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8">
          <p className="text-signal text-xs tracking-widest2 font-bold mb-2">FIRST CLASS FOR UNIFORM</p>
          <h1 className="text-white text-3xl sm:text-4xl font-black">{name}</h1>
          {section && (
            <Link href={`/sections/${section.slug}`} className="inline-block mt-3 text-mist hover:text-white text-sm">
              {ar ? "← قسم " + section.ar : "← " + section.en}
            </Link>
          )}
        </motion.div>
      </section>

      <section className="mx-auto max-w-5xl px-5 sm:px-8 py-10 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="grid grid-cols-2 gap-3">
            {photos.map((_, i) => (
              <WatermarkImage key={i} src={`/products/${product.section}/${i + 1}.jpg`} alt={name} fallbackLabel={name} customizable={false} />
            ))}
          </div>
          <p className="text-steel text-xs mt-2">{ar ? "* صور من شغلنا في نفس القسم — الموديل بيتنفذ حسب طلبك." : "* Photos from our work in this category — made to your specification."}</p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black text-ink mb-2">{ar ? "الوصف" : "Description"}</h2>
            <p className="text-steel leading-8">{desc}</p>
          </div>

          <div>
            <h2 className="text-lg font-black text-ink mb-2">{ar ? "🎨 الألوان المتوفرة" : "🎨 Available colours"}</h2>
            <div className="flex flex-wrap gap-2">
              {(colors.length ? colors : [ar ? "حسب الطلب" : "On request"]).map((c) => (
                <span key={c} className="px-3 py-1 rounded-full bg-paper border border-line text-sm text-ink">{c}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href={whatsappLink(msg)} target="_blank" rel="noopener" className="px-5 py-3 rounded-xl bg-[#1faa59] text-white font-bold">
              {ar ? "💬 اطلب عرض سعر على واتساب" : "💬 Get a quote on WhatsApp"}
            </a>
            <a href={telLink(phones[0])} className="px-5 py-3 rounded-xl border border-line text-ink font-bold">{ar ? "📞 اتصل بينا" : "📞 Call us"}</a>
            <Link href="/quote" className="px-5 py-3 rounded-xl border border-line text-ink font-bold">{ar ? "🧮 احسب التكلفة" : "🧮 Estimate cost"}</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 sm:px-8 pb-12">
        <h2 className="text-lg font-black text-ink mb-1">{ar ? "📏 دليل المقاسات" : "📏 Size guide"}</h2>
        <p className="text-steel text-sm mb-4">{ar ? "تقريبي — بنأكده بعينة مقاسات قبل الإنتاج." : "Approximate — confirmed with a sizing sample before production."}</p>
        {product.sizes.includes("free") ? (
          <p className="text-steel">{ar ? "مقاس فري (واحد يناسب الكل)، وبرباط أو حزام بيتظبط." : "One size fits all, with adjustable ties or strap."}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {product.sizes.filter((s) => s !== "free").map((s) => {
              const t = sizeTables[s as "tops" | "pants"];
              return (
                <div key={s} className="overflow-x-auto">
                  <p className="font-bold text-ink mb-2">{ar ? t.titleAr : t.titleEn}</p>
                  <table className="w-full text-sm border border-line">
                    <thead><tr>{(ar ? t.colsAr : t.colsEn).map((c) => <th key={c} className="bg-paper border border-line p-2">{c}</th>)}</tr></thead>
                    <tbody>{t.rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i} className="border border-line p-2 text-center">{c}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}
        <h3 className="font-bold text-ink mt-6 mb-2">{ar ? "💡 إزاي تعرف مقاسك؟" : "💡 How to find your size"}</h3>
        <ul className="list-disc ps-5 text-steel space-y-1 text-sm">{(ar ? sizeTipsAr : sizeTipsEn).map((t) => <li key={t}>{t}</li>)}</ul>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-5xl px-5 sm:px-8 pb-16">
          <h2 className="text-lg font-black text-ink mb-3">{ar ? "منتجات تانية في نفس القسم" : "More in this category"}</h2>
          <div className="flex flex-wrap gap-2">
            {related.map((p) => (
              <Link key={p.slug} href={`/product/${p.slug}`} className="px-4 py-2 rounded-xl bg-paper border border-line text-ink text-sm hover:border-royal">{ar ? p.ar : p.en}</Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
