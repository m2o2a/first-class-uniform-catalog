"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import CategoryCard from "@/components/CategoryCard";
import SectorGrid from "@/components/SectorGrid";
import { categories, productTypes } from "@/lib/categories";
import { sectors } from "@/lib/sectors";
import SayingsStrip from "@/components/SayingsStrip";
import { DEPOSIT_PERCENT } from "@/lib/pricing";

function ActionCards() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const cards = [
    { href: "/all-products", icon: "🛒", t: ar ? "اطلب دلوقتي" : "Order now", d: ar ? `جاهز: دفع كامل — بتطريز: عربون ${DEPOSIT_PERCENT}%` : `Ready: full pay — Embroidered: ${DEPOSIT_PERCENT}% deposit` },
    { href: "/all-products", icon: "📦", t: ar ? "اطلب عينة" : "Request a sample", d: ar ? "شوف الخامة بإيدك قبل الكمية" : "Feel the fabric before bulk" },
    { href: "/quote", icon: "🧮", t: ar ? "احسب السعر" : "Get a price", d: ar ? "سعر تقريبي فوري حسب الخامة والعدد" : "Instant estimate by fabric & qty" },
    { href: "/account", icon: "👤", t: ar ? "اعمل حساب" : "Create account", d: ar ? "تابع طلباتك وكررها بسهولة" : "Track and reorder easily" }
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.t}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ y: -6 }}
        >
          <Link href={c.href} className="block h-full rounded-2xl border border-line bg-white p-5 hover:border-royal hover:shadow-xl transition-all">
            <span className="text-2xl">{c.icon}</span>
            <p className="font-display font-bold text-ink mt-3">{c.t}</p>
            <p className="text-steel text-xs sm:text-sm mt-1">{c.d}</p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

function StatsStrip() {
  const { lang } = useLang();
  // Only figures backed by the site's own data. Client and production counts
  // stay off until the owner confirms them.
  const stats = [
    { n: "2009", ar: "بداية الرحلة", en: "Founded" },
    { n: String(categories.length), ar: "قسم متخصص", en: "Specialized sections" },
    { n: String(sectors.length), ar: "قطاعات في سابقة أعمالنا", en: "Sectors in our portfolio" }
  ];
  return (
    <div className="grid grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
      {stats.map((s, i) => (
        <motion.div
          key={s.n}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="bg-ink py-8 px-4 text-center"
        >
          <p className="font-display font-bold text-2xl sm:text-3xl text-gradient bg-clip-text">
            <span className="text-white">{s.n}</span>
          </p>
          <p className="text-mist text-xs sm:text-sm mt-1">{lang === "ar" ? s.ar : s.en}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { t, lang } = useLang();
  const featured = categories.slice(0, 8);

  return (
    <>
      <Hero />

      <section className="relative -mt-10 z-20 px-5 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <StatsStrip />
        </div>
      </section>

      <section className="pt-16 pb-4 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <ActionCards />
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
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
              className="inline-flex items-center gap-2 rounded-full border border-ink text-ink text-sm font-semibold px-6 py-3 hover:bg-ink hover:text-white transition-all hover:gap-3"
            >
              {lang === "ar" ? `شوف كل الأقسام (${categories.length})` : `See all ${categories.length} sections`}
              <span aria-hidden>{lang === "ar" ? "←" : "→"}</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-paper border-y border-line">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow={lang === "ar" ? "تسوّق حسب الصنف" : "Shop by product"}
            title={lang === "ar" ? "الأصناف" : "Products"}
            sub={lang === "ar" ? "بنطلون، تيشيرت، قميص، جاكت، مريلة وايبرون — كله بتطريز لوجو شركتك" : "Trousers, tees, shirts, jackets and aprons — all with your logo"}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {productTypes.map((c, i) => (
              <CategoryCard key={c.slug} category={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      <SayingsStrip />

      {/* Customizer teaser — highlights the new interactive feature */}
      <section className="py-16 sm:py-20 bg-paper border-y border-line">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: lang === "ar" ? 24 : -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1 text-[11px] tracking-widest2 font-bold text-royal mb-4">
              {lang === "ar" ? "جديد" : "NEW"}
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink mb-4">
              {lang === "ar" ? "خصّص لونك ولوجوك قبل ما تطلب" : "Preview your color and logo before you order"}
            </h2>
            <p className="text-steel text-sm sm:text-base mb-6 max-w-md">
              {lang === "ar"
                ? "على أي صورة منتج في الموقع، اضغط \"خصّص\" واختار اللون، وارفع لوجو شركتك، وشوف شكل تقريبي للمنتج قبل ما تطلب عرض السعر."
                : "On any product photo, tap \"Customize\" to pick a color and upload your logo — see an approximate preview before requesting a quote."}
            </p>
            <Link
              href="/all-products"
              className="inline-flex items-center gap-2 rounded-full bg-royal text-white text-sm font-semibold px-6 py-3 hover:opacity-90 transition-all hover:gap-3"
            >
              {lang === "ar" ? "جرّب دلوقتي" : "Try it now"}
              <span aria-hidden>{lang === "ar" ? "←" : "→"}</span>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-2xl border border-line bg-white p-6 shadow-xl">
              <div className="flex gap-2 mb-4">
                {["#16308C", "#D62828", "#12141A", "#C9A24B", "#1F6F43"].map((c) => (
                  <span key={c} className="w-7 h-7 rounded-full border-2 border-white shadow" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="aspect-square rounded-xl bg-paper border border-line flex items-center justify-center overflow-hidden">
                <span className="text-steel/40 text-xs">{lang === "ar" ? "معاينة المنتج" : "product preview"}</span>
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -end-4 bg-ink text-white text-xs font-bold rounded-full px-4 py-2 shadow-lg"
            >
              {lang === "ar" ? "لون + لوجو" : "Color + Logo"}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-ink fabric-texture">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading eyebrow={t.projects.eyebrow} title={t.projects.title} sub={t.projects.sub} dark />
          <SectorGrid compact />
          <div className="text-center mt-10">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full bg-white text-ink text-sm font-semibold px-6 py-3 hover:bg-mist transition-all hover:gap-3"
            >
              {lang === "ar" ? "شوف سابقة الأعمال" : "See previous projects"}
              <span aria-hidden>{lang === "ar" ? "←" : "→"}</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-20 sm:py-24 bg-paper overflow-hidden">
        <div className="pointer-events-none absolute top-0 start-1/2 -translate-x-1/2 w-[60vw] h-[60vw] rounded-full bg-royal/5 blur-[120px]" />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-8 text-center">
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
            className="inline-flex items-center gap-2 rounded-full bg-signal text-white text-sm font-semibold px-7 py-3.5 hover:opacity-90 transition-all hover:scale-105"
          >
            {t.nav.contact}
          </Link>
        </div>
      </section>
    </>
  );
}
