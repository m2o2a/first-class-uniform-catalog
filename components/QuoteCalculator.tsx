"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { whatsappLink } from "@/lib/contact";

type Fabric = { id: string; name_ar: string; name_en: string; base_price: number; notes_ar?: string };

type QuoteResult = {
  fabric_name_ar: string;
  fabric_name_en?: string;
  per_piece_price: number;
  quantity: number;
  total_price: number;
  discount_percent: number;
  currency: string;
  recommendation_ar?: string;
  source?: string;
};

export default function QuoteCalculator({ productName }: { productName?: string }) {
  const { lang } = useLang();
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [fabricId, setFabricId] = useState("");
  const [quantity, setQuantity] = useState(50);
  const [logoCount, setLogoCount] = useState(1);
  const [logoPlacement, setLogoPlacement] = useState<"chest" | "back" | "sleeve">("chest");
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/quote")
      .then((r) => r.json())
      .then((d) => {
        setFabrics(d.fabrics || []);
        if (d.fabrics?.[0]) setFabricId(d.fabrics[0].id);
      })
      .catch(() => setError(lang === "ar" ? "تعذر تحميل الخامات" : "Could not load fabrics"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getQuote = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity, fabricId, logoCount, logoPlacement, product: productName, lang })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "failed");
      setResult(data.quote);
    } catch {
      setError(lang === "ar" ? "حصل خطأ، حاول تاني" : "Something went wrong, try again");
    } finally {
      setLoading(false);
    }
  };

  const t = {
    title: lang === "ar" ? "احسب سعرك فورًا" : "Get an instant estimate",
    sub:
      lang === "ar"
        ? "سعر تقريبي فوري — والفريق يتواصل معاك لتأكيد التفاصيل النهائية"
        : "Instant estimate — our team follows up to confirm final details",
    fabric: lang === "ar" ? "نوع الخامة" : "Fabric type",
    quantity: lang === "ar" ? "العدد" : "Quantity",
    logoCount: lang === "ar" ? "عدد اللوجوهات" : "Number of logos",
    logoPlacement: lang === "ar" ? "مكان اللوجو" : "Logo placement",
    chest: lang === "ar" ? "الصدر" : "Chest",
    back: lang === "ar" ? "الضهر" : "Back",
    sleeve: lang === "ar" ? "الكم" : "Sleeve",
    calc: lang === "ar" ? "احسب السعر" : "Calculate price",
    calculating: lang === "ar" ? "جارٍ الحساب..." : "Calculating...",
    perPiece: lang === "ar" ? "سعر القطعة" : "Per piece",
    total: lang === "ar" ? "الإجمالي" : "Total",
    discount: lang === "ar" ? "خصم الكمية" : "Quantity discount",
    whatsapp: lang === "ar" ? "أكّد الطلب على واتساب" : "Confirm on WhatsApp"
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-6 sm:p-7">
      <p className="text-signal text-[11px] tracking-widest2 font-bold mb-1">FIRST CLASS FOR UNIFORM</p>
      <h3 className="font-display font-bold text-ink text-xl mb-1">{t.title}</h3>
      <p className="text-steel text-sm mb-6">{t.sub}</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="text-xs font-semibold text-steel mb-1.5 block">{t.fabric}</label>
          <select
            value={fabricId}
            onChange={(e) => setFabricId(e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm text-ink focus:border-royal focus:outline-none bg-white"
          >
            {fabrics.map((f) => (
              <option key={f.id} value={f.id}>
                {lang === "ar" ? f.name_ar : f.name_en}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-steel mb-1.5 block">{t.quantity}</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm text-ink focus:border-royal focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-steel mb-1.5 block">{t.logoCount}</label>
          <input
            type="number"
            min={0}
            value={logoCount}
            onChange={(e) => setLogoCount(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm text-ink focus:border-royal focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-steel mb-1.5 block">{t.logoPlacement}</label>
          <select
            value={logoPlacement}
            onChange={(e) => setLogoPlacement(e.target.value as "chest" | "back" | "sleeve")}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm text-ink focus:border-royal focus:outline-none bg-white"
          >
            <option value="chest">{t.chest}</option>
            <option value="back">{t.back}</option>
            <option value="sleeve">{t.sleeve}</option>
          </select>
        </div>
      </div>

      <button
        onClick={getQuote}
        disabled={loading || !fabricId}
        className="w-full rounded-full bg-royal text-white text-sm font-semibold px-6 py-3.5 hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {loading ? t.calculating : t.calc}
      </button>

      {error && <p className="text-signal text-xs mt-3">{error}</p>}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 rounded-xl bg-paper border border-line p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-steel text-sm">{t.perPiece}</span>
              <span className="font-display font-bold text-ink">
                {result.per_piece_price} {result.currency}
              </span>
            </div>
            {result.discount_percent > 0 && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-steel text-sm">{t.discount}</span>
                <span className="text-good font-semibold text-sm" style={{ color: "#1F6F43" }}>
                  -{result.discount_percent}%
                </span>
              </div>
            )}
            <div className="flex items-center justify-between mb-3 pt-3 border-t border-line">
              <span className="text-ink font-semibold">{t.total}</span>
              <span className="font-display font-bold text-royal text-xl">
                {result.total_price.toLocaleString()} {result.currency}
              </span>
            </div>
            {result.recommendation_ar && lang === "ar" && (
              <p className="text-steel text-xs bg-white rounded-lg p-3 border border-line mb-3">
                💡 {result.recommendation_ar}
              </p>
            )}
            <a
              href={whatsappLink(
                lang === "ar"
                  ? `مرحبًا، عايز أأكد طلب: ${productName || ""} — العدد ${quantity}، خامة ${result.fabric_name_ar}، ${logoCount} لوجو — السعر التقريبي ${result.total_price} جنيه`
                  : `Hi, I'd like to confirm an order: ${productName || ""} — qty ${quantity}, fabric ${result.fabric_name_en || result.fabric_name_ar}, ${logoCount} logo(s) — estimated ${result.total_price} EGP`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center rounded-full bg-[#25D366] text-white text-sm font-semibold px-6 py-3 hover:opacity-90 transition-opacity"
            >
              {t.whatsapp}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
