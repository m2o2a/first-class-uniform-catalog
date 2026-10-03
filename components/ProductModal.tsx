"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { useCart, OrderType } from "@/lib/cart-context";
import { whatsappLink } from "@/lib/contact";

type Props = {
  open: boolean;
  onClose: () => void;
  src: string;
  name: string;
  categorySlug: string;
  onCustomize: () => void;
};

export default function ProductModal({ open, onClose, src, name, categorySlug, onCustomize }: Props) {
  const { lang } = useLang();
  const ar = lang === "ar";
  const { add } = useCart();
  const [added, setAdded] = useState<OrderType | null>(null);
  const [view, setView] = useState<"main" | "sample" | "sampleDone">("main");
  const [form, setForm] = useState({ name: "", phone: "", company: "", address: "" });
  const [sending, setSending] = useState(false);
  const [notified, setNotified] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!open) {
      setView("main");
      setAdded(null);
      setErr("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const addToCart = (type: OrderType) => {
    add({ id: `${src}::${type}`, src, name, categorySlug, type });
    setAdded(type);
  };

  const sendSample = async () => {
    if (!form.name.trim() || form.phone.replace(/\D/g, "").length < 10) {
      setErr(ar ? "اكتب الاسم ورقم موبايل صحيح" : "Enter your name and a valid phone");
      return;
    }
    setSending(true);
    setErr("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, product: name, image: src, type: "sample", lang })
      });
      const data = await res.json();
      if (!data.ok) throw new Error();
      setNotified(!!data.notified);
      setView("sampleDone");
    } catch {
      setErr(ar ? "حصل خطأ، حاول تاني" : "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  const input =
    "w-full rounded-xl border border-line px-4 py-3 text-sm text-ink focus:border-royal focus:outline-none";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-ink/70 backdrop-blur-sm p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="relative w-full sm:max-w-4xl max-h-[92svh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl grid md:grid-cols-2"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 end-3 z-10 w-9 h-9 rounded-full bg-white/90 text-ink shadow flex items-center justify-center hover:bg-white"
            >
              ✕
            </button>

            <div className="relative aspect-square md:aspect-auto md:min-h-[520px] bg-paper overflow-hidden">
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image src={src} alt={name} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </motion.div>
              <div className="absolute bottom-3 end-3">
                <span className="block rounded-full bg-white/90 p-1 shadow"><Image src="/logo/logo-mark.png" alt="" width={34} height={34} /></span>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col">
              <p className="text-signal text-[11px] tracking-widest2 font-bold mb-1">FIRST CLASS FOR UNIFORM</p>
              <h3 className="font-display font-bold text-ink text-2xl mb-5">{name}</h3>

              {view === "main" && (
                <>
                  <div className="space-y-3 mb-5">
                    <button
                      onClick={() => addToCart("ready")}
                      className="w-full text-start rounded-2xl border-2 border-line hover:border-royal p-4 transition-colors"
                    >
                      <span className="block font-bold text-ink text-sm">
                        {ar ? "🛒 اطلب قطعة جاهزة (من غير تطريز)" : "🛒 Order ready piece (no embroidery)"}
                      </span>
                      <span className="block text-steel text-xs mt-1">
                        {ar ? "دفع كامل — للمقاسات المتوفرة" : "Full payment — for in-stock sizes"}
                      </span>
                    </button>
                    <button
                      onClick={() => addToCart("custom")}
                      className="w-full text-start rounded-2xl border-2 border-line hover:border-royal p-4 transition-colors"
                    >
                      <span className="block font-bold text-ink text-sm">
                        {ar ? "🧵 اطلب بتطريز لوجو شركتك" : "🧵 Order with your logo embroidered"}
                      </span>
                      <span className="block text-steel text-xs mt-1">
                        {ar ? "عربون 50% والباقي عند الاستلام" : "50% deposit, rest on delivery"}
                      </span>
                    </button>
                  </div>

                  <AnimatePresence>
                    {added && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-5 rounded-xl bg-[#E8F5EC] text-[#1F6F43] text-sm p-3 flex items-center justify-between gap-3"
                      >
                        <span>{ar ? "✓ اتضاف للسلة" : "✓ Added to cart"}</span>
                        <Link href="/cart" onClick={onClose} className="font-bold underline">
                          {ar ? "كمّل الطلب" : "Checkout"}
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    <button
                      onClick={() => setView("sample")}
                      className="rounded-full border border-ink text-ink text-xs font-bold px-3 py-3 hover:bg-ink hover:text-white transition-colors"
                    >
                      {ar ? "اطلب عينة" : "Request sample"}
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onCustomize();
                      }}
                      className="rounded-full border border-ink text-ink text-xs font-bold px-3 py-3 hover:bg-ink hover:text-white transition-colors"
                    >
                      {ar ? "خصّص" : "Customize"}
                    </button>
                    <Link
                      href={`/quote?model=${categorySlug}`}
                      onClick={onClose}
                      className="rounded-full bg-gold text-ink text-xs font-bold px-3 py-3 text-center hover:opacity-90"
                    >
                      {ar ? "احسب السعر" : "Get quote"}
                    </Link>
                  </div>
                  <Link href="/guide" onClick={onClose} className="text-royal text-xs font-semibold mt-4 hover:underline">
                    {ar ? "ازاي أختار المقاس والخامة؟ ←" : "How to choose size & fabric →"}
                  </Link>
                </>
              )}

              {view === "sample" && (
                <div className="space-y-3">
                  <p className="text-steel text-sm mb-1">
                    {ar
                      ? "هنجهزلك عينة من المنتج ده تشوف الخامة والتقفيل بنفسك قبل الطلب."
                      : "We'll prepare a sample so you can check the fabric and finish before ordering."}
                  </p>
                  <input className={input} placeholder={ar ? "الاسم" : "Name"} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <input className={input} placeholder={ar ? "رقم الموبايل" : "Phone"} inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <input className={input} placeholder={ar ? "اسم الشركة (اختياري)" : "Company (optional)"} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                  <input className={input} placeholder={ar ? "العنوان" : "Address"} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  {err && <p className="text-signal text-xs">{err}</p>}
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setView("main")} className="rounded-full border border-line text-steel text-sm px-5 py-3">
                      {ar ? "رجوع" : "Back"}
                    </button>
                    <button
                      onClick={sendSample}
                      disabled={sending}
                      className="flex-1 rounded-full bg-royal text-white text-sm font-semibold px-6 py-3 disabled:opacity-60"
                    >
                      {sending ? (ar ? "جارٍ الإرسال..." : "Sending...") : ar ? "ابعت طلب العينة" : "Send sample request"}
                    </button>
                  </div>
                </div>
              )}

              {view === "sampleDone" && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">✓</div>
                  <p className="font-bold text-ink mb-1">{ar ? "طلب العينة وصلنا" : "Sample request received"}</p>
                  <p className="text-steel text-sm">
                    {ar ? "هنكلمك خلال 24 ساعة نتفق على التفاصيل." : "We'll call you within 24 hours."}
                  </p>
                  {!notified && (
                    <a
                      href={whatsappLink(
                        `${ar ? "طلب عينة" : "Sample request"}: ${name}\n${form.name} — ${form.phone}` +
                          (form.company ? `\n${form.company}` : "") +
                          (form.address ? `\n${form.address}` : "")
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-5 rounded-full bg-[#25D366] text-white text-sm font-semibold px-6 py-3"
                    >
                      {ar ? "أكّد الطلب على واتساب" : "Confirm on WhatsApp"}
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
