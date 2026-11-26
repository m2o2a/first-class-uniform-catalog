"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { useCart } from "@/lib/cart-context";
import { estimatePiece, DEPOSIT_PERCENT } from "@/lib/pricing";
import { paymentConfig } from "@/lib/payment-config";
import { whatsappLink } from "@/lib/contact";
import { supabase, useSession } from "@/lib/supabase";
import PageBanner from "@/components/PageBanner";

type Mode = "full" | "deposit" | "quote";

export default function CartPage() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const { items, update, remove, clear } = useCart();
  const { session } = useSession();
  const [wantQuote, setWantQuote] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "", company: "", address: "", notes: "" });
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState<{ orderNo: string; mode: Mode; due: number; notified: boolean; summary: string } | null>(null);

  useEffect(() => {
    try {
      setCustomer((c) => ({
        ...c,
        name: c.name || localStorage.getItem("fc_lead_name") || "",
        phone: c.phone || localStorage.getItem("fc_lead_phone") || ""
      }));
    } catch {}
  }, []);

  const hasCustom = items.some((i) => i.type === "custom");
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const mode: Mode = wantQuote ? "quote" : hasCustom ? "deposit" : "full";

  const total = useMemo(
    () => items.reduce((s, i) => s + estimatePiece(i) * i.qty, 0),
    [items]
  );
  const due = mode === "full" ? total : mode === "deposit" ? Math.round((total * DEPOSIT_PERCENT) / 100) : 0;

  const submit = async () => {
    if (!customer.name.trim() || customer.phone.replace(/\D/g, "").length < 10) {
      setErr(ar ? "اكتب الاسم ورقم موبايل صحيح" : "Enter your name and a valid phone");
      return;
    }
    setSending(true);
    setErr("");
    try {
      const payloadItems = items.map((i) => ({
        name: i.name,
        src: i.src,
        qty: i.qty,
        type: i.type,
        logos: i.logos,
        estimate: estimatePiece(i)
      }));
      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session ? { Authorization: `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({ customer, items: payloadItems, mode, total, due, lang })
      });
      const data = await res.json();
      if (!data.ok) throw new Error();

      // The server already saved it when SUPABASE_SERVICE_ROLE_KEY is set
      if (!data.saved && supabase && session) {
        await supabase.from("orders").insert({
          user_id: session.user.id,
          order_no: data.orderNo,
          mode,
          items: payloadItems,
          total,
          due,
          status: "new"
        });
      }
      try {
        localStorage.setItem("fc_lead_name", customer.name);
        localStorage.setItem("fc_lead_phone", customer.phone);
      } catch {}
      const summary =
        `${ar ? "طلب" : "Order"} ${data.orderNo}\n` +
        `${ar ? "الاسم" : "Name"}: ${customer.name} — ${customer.phone}\n` +
        (customer.company ? `${ar ? "الشركة" : "Company"}: ${customer.company}\n` : "") +
        (customer.address ? `${ar ? "العنوان" : "Address"}: ${customer.address}\n` : "") +
        payloadItems
          .map((i) => `• ${i.name} × ${i.qty} — ${i.type === "custom" ? (ar ? `بتطريز (${i.logos} لوجو)` : `embroidered (${i.logos})`) : ar ? "جاهز" : "ready"}`)
          .join("\n") +
        (customer.notes ? `\n${ar ? "ملاحظات" : "Notes"}: ${customer.notes}` : "") +
        (mode !== "quote" ? `\n${ar ? "الإجمالي التقديري" : "Estimated total"}: ${total} — ${ar ? "المطلوب" : "Due"}: ${due}` : `\n${ar ? "طلب عرض سعر" : "Quote request"}`);
      setDone({ orderNo: data.orderNo, mode, due, notified: !!data.notified, summary });
      clear();
    } catch {
      setErr(ar ? "حصل خطأ، حاول تاني أو كلمنا واتساب" : "Something went wrong — try again or WhatsApp us");
    } finally {
      setSending(false);
    }
  };

  const input =
    "w-full rounded-xl border border-line px-4 py-3 text-sm text-ink focus:border-royal focus:outline-none bg-white";

  if (done) {
    const hasPayInfo = paymentConfig.instapay || paymentConfig.vodafoneCash;
    return (
      <>
        <PageBanner eyebrow={ar ? "تم الطلب" : "Order placed"} title={ar ? "شكرًا لثقتك" : "Thank you"} />
        <section className="py-14 bg-white">
          <div className="mx-auto max-w-xl px-5 text-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl mb-4">
              ✓
            </motion.div>
            <p className="text-steel text-sm mb-1">{ar ? "رقم طلبك" : "Your order number"}</p>
            <p className="font-display font-bold text-3xl text-ink mb-6 tracking-wider">{done.orderNo}</p>

            {done.mode !== "quote" ? (
              <div className="rounded-2xl border border-line bg-paper p-5 text-start mb-6">
                <p className="font-bold text-ink mb-2">
                  {ar ? `المطلوب تحويله: ${done.due.toLocaleString()} جنيه` : `Amount to transfer: ${done.due.toLocaleString()} EGP`}
                </p>
                {hasPayInfo ? (
                  <ul className="text-sm text-steel space-y-1">
                    {paymentConfig.instapay && <li>InstaPay: <b className="text-ink">{paymentConfig.instapay}</b></li>}
                    {paymentConfig.vodafoneCash && (
                      <li>{ar ? "فودافون كاش" : "Vodafone Cash"}: <b className="text-ink">{paymentConfig.vodafoneCash}</b></li>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-steel">
                    {ar
                      ? "هنبعتلك بيانات التحويل (InstaPay / فودافون كاش) على واتساب بعد ما نأكد الطلب والسعر النهائي."
                      : "We'll send transfer details (InstaPay / Vodafone Cash) on WhatsApp after confirming the final price."}
                  </p>
                )}
                <p className="text-xs text-steel mt-3">
                  {ar ? "السعر ده تقديري، والفريق هيأكد السعر النهائي معاك." : "This is an estimate; the team confirms the final price."}
                </p>
              </div>
            ) : (
              <p className="text-steel text-sm mb-6">
                {ar ? "هنبعتلك عرض السعر خلال 24 ساعة." : "We'll send your quote within 24 hours."}
              </p>
            )}

            {!done.notified && (
              <p className="font-bold text-signal text-sm mb-3">
                {ar ? "آخر خطوة: اضغط الزرار وابعت الطلب على واتساب عشان يوصلنا ونأكده" : "Last step: tap below to send your order on WhatsApp so we can confirm it"}
              </p>
            )}
            <a
              href={whatsappLink(done.summary)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-[#25D366] text-white text-sm font-semibold px-7 py-3.5 hover:opacity-90"
            >
              {!done.notified
                ? ar ? "ابعت الطلب على واتساب" : "Send order on WhatsApp"
                : done.mode !== "quote"
                ? ar ? "ابعت صورة التحويل على واتساب" : "Send transfer receipt on WhatsApp"
                : ar ? "تابع طلبك على واتساب" : "Follow up on WhatsApp"}
            </a>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageBanner eyebrow={ar ? "سلة الطلبات" : "Cart"} title={ar ? "طلبك" : "Your order"} />
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-steel mb-6">{ar ? "السلة فاضية لسه" : "Your cart is empty"}</p>
              <Link href="/all-products" className="rounded-full bg-royal text-white text-sm font-semibold px-7 py-3.5">
                {ar ? "تصفح المنتجات" : "Browse products"}
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_380px] gap-8">
              <div className="space-y-3">
                <AnimatePresence>
                  {items.map((i) => (
                    <motion.div
                      key={i.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: ar ? 40 : -40 }}
                      className="flex gap-4 rounded-2xl border border-line p-3"
                    >
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-paper flex-shrink-0">
                        <Image src={i.src} alt={i.name} fill sizes="112px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-ink text-sm">{i.name}</p>
                            <p className="text-xs text-steel mt-0.5">
                              {i.type === "custom" ? (ar ? "بتطريز — عربون 50%" : "Embroidered — 50% deposit") : ar ? "جاهز — دفع كامل" : "Ready — full payment"}
                            </p>
                          </div>
                          <button onClick={() => remove(i.id)} className="text-steel hover:text-signal text-sm" aria-label="Remove">
                            ✕
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <label className="flex items-center gap-2 text-xs text-steel">
                            {ar ? "العدد" : "Qty"}
                            <input
                              type="number"
                              min={1}
                              value={i.qty}
                              onChange={(e) => update(i.id, { qty: Math.max(1, parseInt(e.target.value) || 1) })}
                              className="w-20 rounded-lg border border-line px-2 py-1.5 text-sm text-ink text-center"
                            />
                          </label>
                          {i.type === "custom" && (
                            <label className="flex items-center gap-2 text-xs text-steel">
                              {ar ? "تطريزات بالقطعة" : "Logos / piece"}
                              <input
                                type="number"
                                min={1}
                                value={i.logos}
                                onChange={(e) => update(i.id, { logos: Math.max(1, parseInt(e.target.value) || 1) })}
                                className="w-16 rounded-lg border border-line px-2 py-1.5 text-sm text-ink text-center"
                              />
                            </label>
                          )}
                          <span className="ms-auto text-sm font-bold text-ink">
                            {(estimatePiece(i) * i.qty).toLocaleString()} {ar ? "ج" : "EGP"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="lg:sticky lg:top-24 h-fit rounded-2xl border border-line bg-paper p-5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-steel">{ar ? "الإجمالي التقديري" : "Estimated total"}</span>
                  <span className="font-bold text-ink">{total.toLocaleString()} {ar ? "ج" : "EGP"}</span>
                </div>

                <label className="flex items-start gap-2 text-sm text-ink cursor-pointer">
                  <input type="checkbox" checked={wantQuote} onChange={(e) => setWantQuote(e.target.checked)} className="mt-1" />
                  <span>
                    {ar ? "عايز عرض سعر رسمي بدل الدفع دلوقتي" : "I want a formal quote instead of paying now"}
                    {totalQty >= 50 && !wantQuote && (
                      <span className="block text-xs text-royal mt-0.5">
                        {ar ? "مناسب لطلبك لأن العدد كبير" : "Recommended for large quantities"}
                      </span>
                    )}
                  </span>
                </label>

                <div className="rounded-xl bg-white border border-line p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-steel">
                      {mode === "full" ? (ar ? "دفع كامل" : "Full payment") : mode === "deposit" ? (ar ? `عربون ${DEPOSIT_PERCENT}%` : `${DEPOSIT_PERCENT}% deposit`) : ar ? "عرض سعر" : "Quote"}
                    </span>
                    <span className="font-display font-bold text-royal text-lg">
                      {mode === "quote" ? "—" : `${due.toLocaleString()} ${ar ? "ج" : "EGP"}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-steel mt-1">
                    {ar ? "أسعار تقديرية — السعر النهائي بيتأكد معاك." : "Estimates — final price confirmed with you."}
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  <input className={input} placeholder={ar ? "الاسم" : "Name"} value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
                  <input className={input} placeholder={ar ? "رقم الموبايل" : "Phone"} inputMode="tel" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
                  <input className={input} placeholder={ar ? "اسم الشركة (اختياري)" : "Company (optional)"} value={customer.company} onChange={(e) => setCustomer({ ...customer, company: e.target.value })} />
                  <input className={input} placeholder={ar ? "العنوان" : "Address"} value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
                  <textarea className={input} rows={2} placeholder={ar ? "ملاحظات (مقاسات، ألوان...)" : "Notes (sizes, colors...)"} value={customer.notes} onChange={(e) => setCustomer({ ...customer, notes: e.target.value })} />
                </div>

                {err && <p className="text-signal text-xs">{err}</p>}
                <button
                  onClick={submit}
                  disabled={sending}
                  className="w-full rounded-full bg-royal text-white text-sm font-semibold px-6 py-3.5 hover:opacity-90 disabled:opacity-60"
                >
                  {sending ? (ar ? "جارٍ الإرسال..." : "Sending...") : mode === "quote" ? (ar ? "ابعت طلب عرض السعر" : "Request quote") : ar ? "أكّد الطلب" : "Confirm order"}
                </button>
                {!session && (
                  <p className="text-xs text-steel text-center">
                    <Link href="/account" className="text-royal font-semibold hover:underline">
                      {ar ? "سجّل دخول" : "Sign in"}
                    </Link>{" "}
                    {ar ? "عشان تتابع طلباتك بعدين" : "to track your orders later"}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
