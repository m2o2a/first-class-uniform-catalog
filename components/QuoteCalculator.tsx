"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { whatsappLink } from "@/lib/contact";

type Fabric = { id: string; name_ar: string; name_en: string; raw_material_price: number; unit_price: number; notes_ar?: string };
type PricedOption = { id: string; name_ar: string; price: number };

type EmbroideryRow = { id: number; placement: string; count: number };

type QuoteResult = {
  fabric_name_ar: string;
  fabric_name_en?: string;
  model_name_ar?: string;
  shape_name_ar?: string;
  per_piece_price: number;
  quantity: number;
  total_logos: number;
  total_price: number;
  discount_percent: number;
  currency: string;
  recommendation_ar?: string;
  source?: string;
};

let rowIdSeq = 1;

export default function QuoteCalculator({ productName }: { productName?: string }) {
  const { lang } = useLang();
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [models, setModels] = useState<PricedOption[]>([]);
  const [shapes, setShapes] = useState<PricedOption[]>([]);
  const [placements, setPlacements] = useState<string[]>([]);
  const [fabricId, setFabricId] = useState("");
  const [modelId, setModelId] = useState("");
  const [shapeId, setShapeId] = useState("");
  const [quantity, setQuantity] = useState(50);
  const [embroideries, setEmbroideries] = useState<EmbroideryRow[]>([
    { id: rowIdSeq++, placement: "", count: 1 }
  ]);
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/quote")
      .then((r) => r.json())
      .then((d) => {
        setFabrics(d.fabrics || []);
        if (d.fabrics?.[0]) setFabricId(d.fabrics[0].id);
        setModels(d.models || []);
        const pre = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("model") : null;
        const hit = pre && (d.models || []).find((m: PricedOption) => m.id === pre);
        if (hit) setModelId(hit.id);
        else if (d.models?.[0]) setModelId(d.models[0].id);
        setShapes(d.shapes || []);
        if (d.shapes?.[0]) setShapeId(d.shapes[0].id);
        setPlacements(d.embroidery_placements_ar || []);
        if (d.embroidery_placements_ar?.[0]) {
          setEmbroideries([{ id: rowIdSeq++, placement: d.embroidery_placements_ar[0], count: 1 }]);
        }
      })
      .catch(() => setError(lang === "ar" ? "تعذر تحميل الخامات" : "Could not load fabrics"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addEmbroideryRow = () => {
    setEmbroideries((rows) => [
      ...rows,
      { id: rowIdSeq++, placement: placements[0] || "", count: 1 }
    ]);
  };

  const removeEmbroideryRow = (id: number) => {
    setEmbroideries((rows) => (rows.length > 1 ? rows.filter((r) => r.id !== id) : rows));
  };

  const updateEmbroideryRow = (id: number, patch: Partial<EmbroideryRow>) => {
    setEmbroideries((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const getQuote = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity,
          fabricId,
          modelId,
          shapeId,
          embroideries: embroideries.map((r) => ({ placement: r.placement, count: r.count })),
          product: productName,
          lang
        })
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
    model: lang === "ar" ? "الموديل" : "Model",
    shape: lang === "ar" ? "الشكل" : "Shape",
    quantity: lang === "ar" ? "العدد" : "Quantity",
    embroideries: lang === "ar" ? "التطريزات على القطعة" : "Embroidery on the piece",
    placement: lang === "ar" ? "مكان التطريز" : "Placement",
    count: lang === "ar" ? "العدد" : "Count",
    addEmbroidery: lang === "ar" ? "+ أضف تطريزة تانية" : "+ Add another embroidery",
    remove: lang === "ar" ? "حذف" : "Remove",
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
          <label className="text-xs font-semibold text-steel mb-1.5 block">{t.model}</label>
          <select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm text-ink focus:border-royal focus:outline-none bg-white"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name_ar}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-steel mb-1.5 block">{t.shape}</label>
          <select
            value={shapeId}
            onChange={(e) => setShapeId(e.target.value)}
            className="w-full rounded-xl border border-line px-4 py-3 text-sm text-ink focus:border-royal focus:outline-none bg-white"
          >
            {shapes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name_ar}
              </option>
            ))}
          </select>
        </div>

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
      </div>

      <div className="mb-5">
        <label className="text-xs font-semibold text-steel mb-2 block">{t.embroideries}</label>
        <div className="space-y-2.5">
          {embroideries.map((row) => (
            <div key={row.id} className="flex items-center gap-2">
              <select
                value={row.placement}
                onChange={(e) => updateEmbroideryRow(row.id, { placement: e.target.value })}
                className="flex-1 rounded-xl border border-line px-3 py-2.5 text-sm text-ink focus:border-royal focus:outline-none bg-white"
              >
                {placements.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={row.count}
                onChange={(e) =>
                  updateEmbroideryRow(row.id, { count: Math.max(1, parseInt(e.target.value) || 1) })
                }
                className="w-20 rounded-xl border border-line px-3 py-2.5 text-sm text-ink focus:border-royal focus:outline-none text-center"
              />
              {embroideries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEmbroideryRow(row.id)}
                  aria-label={t.remove}
                  className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full text-signal hover:bg-signal/10 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addEmbroideryRow}
          className="mt-2.5 text-royal text-sm font-semibold hover:underline"
        >
          {t.addEmbroidery}
        </button>
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
                  ? `مرحبًا، عايز أأكد طلب: ${productName || result.model_name_ar || ""} — شكل ${result.shape_name_ar}، العدد ${quantity}، خامة ${result.fabric_name_ar}، ${result.total_logos} تطريزة — السعر التقريبي ${result.total_price} جنيه`
                  : `Hi, I'd like to confirm an order: ${productName || result.model_name_ar || ""} — qty ${quantity}, fabric ${result.fabric_name_en || result.fabric_name_ar}, ${result.total_logos} embroidery item(s) — estimated ${result.total_price} EGP`
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
