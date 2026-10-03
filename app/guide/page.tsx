"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import pricing from "@/lib/pricing-rules.json";
import PageBanner from "@/components/PageBanner";
import SayingsStrip from "@/components/SayingsStrip";

// جدول مقاسات تقريبي (سم) — عدّله بمقاساتك الفعلية
const sizes = [
  { s: "S", chest: 96, length: 70, sleeve: 60 },
  { s: "M", chest: 102, length: 72, sleeve: 61 },
  { s: "L", chest: 108, length: 74, sleeve: 62 },
  { s: "XL", chest: 114, length: 76, sleeve: 63 },
  { s: "2XL", chest: 120, length: 78, sleeve: 64 },
  { s: "3XL", chest: 126, length: 80, sleeve: 65 },
  { s: "4XL", chest: 132, length: 82, sleeve: 66 }
];

const steps = [
  { ar: "اختار المنتج", en: "Pick a product", dAr: "من الأقسام أو كل المنتجات، واضغط على الصورة.", dEn: "From sections or all products, tap a photo." },
  { ar: "خصّص وشوف السعر", en: "Customize & price", dAr: "جرّب لونك ولوجوك، واحسب السعر التقريبي.", dEn: "Try your color & logo, get an estimate." },
  { ar: "اطلب عينة لو محتاج", en: "Order a sample", dAr: "شوف الخامة والتقفيل بإيدك قبل الكمية.", dEn: "Feel the fabric and finish first." },
  { ar: "أكّد وادفع", en: "Confirm & pay", dAr: "جاهز: دفع كامل. بتطريز: عربون 50%. كميات كبيرة: عرض سعر.", dEn: "Ready: full pay. Embroidered: 50% deposit. Bulk: quote." },
  { ar: "استلم", en: "Receive", dAr: "بنتابع معاك مراحل التصنيع لحد التسليم.", dEn: "We update you until delivery." }
];

const care = [
  { ar: "اغسل على 30–40 درجة ولوّن مع بعضه", en: "Wash at 30–40°C, like colors together" },
  { ar: "اقلب القطعة على الوش قبل الغسيل عشان التطريز يعيش", en: "Turn inside out to protect embroidery" },
  { ar: "ما تستخدمش كلور على الألوان", en: "No bleach on colored garments" },
  { ar: "اكوي على حرارة متوسطة ومن غير ما تكوي على التطريز مباشرة", en: "Medium iron, avoid ironing directly on embroidery" }
];

const faqs = [
  { qAr: "أقل كمية أطلبها كام؟", qEn: "Minimum order?", aAr: "القطع الجاهزة من غير تطريز ممكن تطلب منها قطعة واحدة. الطلبات بالتطريز بنتفق عليها حسب الموديل.", aEn: "Ready pieces from 1. Embroidered orders depend on the model." },
  { qAr: "التسليم بياخد قد إيه؟", qEn: "Lead time?", aAr: "الجاهز خلال أيام، والتفصيل والتطريز حسب الكمية — بنحدد الميعاد معاك عند التأكيد.", aEn: "Ready: days. Custom: depends on quantity — confirmed with you." },
  { qAr: "ينفع أشوف عينة الأول؟", qEn: "Can I see a sample?", aAr: "أيوه، من أي صورة منتج اضغط \"اطلب عينة\".", aEn: "Yes — tap \"Request sample\" on any product." },
  { qAr: "السعر في الموقع نهائي؟", qEn: "Is the site price final?", aAr: "لأ، تقديري. الفريق بيأكد السعر النهائي حسب الخامة والكمية والتطريز.", aEn: "No, it's an estimate; the team confirms the final price." }
];

export default function GuidePage() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <PageBanner
        eyebrow={ar ? "دليل الشراء" : "Buying guide"}
        title={ar ? "اطلب صح من أول مرة" : "Order right the first time"}
        sub={ar ? "خطوات الطلب، المقاسات، الخامات، والعناية" : "Steps, sizes, fabrics and care"}
      />

      {/* Steps */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-display font-bold text-2xl text-ink mb-8">{ar ? "خطوات الطلب" : "How to order"}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative rounded-2xl border border-line p-5 bg-paper"
              >
                <span className="font-display font-bold text-4xl text-royal/20">0{i + 1}</span>
                <p className="font-bold text-ink mt-2">{ar ? s.ar : s.en}</p>
                <p className="text-steel text-sm mt-1">{ar ? s.dAr : s.dEn}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SayingsStrip />

      {/* Size chart */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <h2 className="font-display font-bold text-2xl text-ink mb-2">{ar ? "جدول المقاسات" : "Size chart"}</h2>
          <p className="text-steel text-sm mb-6">
            {ar ? "القياسات بالسنتيمتر وتقريبية. قيس عرض الصدر تحت الإبط، وزوّد 4–6 سم للراحة." : "Centimetres, approximate. Measure chest under the arms and add 4–6 cm for comfort."}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full text-sm text-center min-w-[420px]">
              <thead className="bg-ink text-white">
                <tr>
                  <th className="py-3 px-3">{ar ? "المقاس" : "Size"}</th>
                  <th className="py-3 px-3">{ar ? "محيط الصدر" : "Chest"}</th>
                  <th className="py-3 px-3">{ar ? "الطول" : "Length"}</th>
                  <th className="py-3 px-3">{ar ? "الكم" : "Sleeve"}</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((r, i) => (
                  <tr key={r.s} className={i % 2 ? "bg-paper" : "bg-white"}>
                    <td className="py-3 px-3 font-bold text-ink">{r.s}</td>
                    <td className="py-3 px-3 text-steel">{r.chest}</td>
                    <td className="py-3 px-3 text-steel">{r.length}</td>
                    <td className="py-3 px-3 text-steel">{r.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Fabrics */}
      <section className="py-14 sm:py-20 bg-ink fabric-texture">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-display font-bold text-2xl text-white mb-8">{ar ? "تختار أنهي خامة؟" : "Which fabric?"}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pricing.fabrics.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p className="font-display font-bold text-white text-lg">{ar ? f.name_ar : f.name_en}</p>
                <p className="text-mist text-sm mt-2">{f.notes_ar}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Care + FAQ */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display font-bold text-2xl text-ink mb-6">{ar ? "العناية بالقطعة" : "Garment care"}</h2>
            <ul className="space-y-3">
              {care.map((c, i) => (
                <li key={i} className="flex gap-3 text-sm text-ink">
                  <span className="text-gold">✦</span>
                  {ar ? c.ar : c.en}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-ink mb-6">{ar ? "أسئلة بتتكرر" : "FAQ"}</h2>
            <div className="space-y-2">
              {faqs.map((f, i) => (
                <div key={i} className="rounded-xl border border-line overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-start font-semibold text-ink text-sm"
                  >
                    {ar ? f.qAr : f.qEn}
                    <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} className="text-royal text-lg">+</motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm text-steel">{ar ? f.aAr : f.aEn}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center mt-12">
          <Link href="/all-products" className="rounded-full bg-royal text-white text-sm font-semibold px-8 py-3.5 hover:opacity-90">
            {ar ? "ابدأ طلبك" : "Start your order"}
          </Link>
        </div>
      </section>
    </>
  );
}
