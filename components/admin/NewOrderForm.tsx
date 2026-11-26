"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { makeOrderNo, Order } from "@/lib/orders";

// For orders that come by phone / WhatsApp / walk-in, so everything lives in one place.
export default function NewOrderForm({ onCreated, onClose }: { onCreated: (o: Order) => void; onClose: () => void }) {
  const [f, setF] = useState({ name: "", phone: "", company: "", item: "", qty: "", total: "", due_date: "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const input = "w-full rounded-xl border border-line px-3 py-2.5 text-sm text-ink focus:border-royal focus:outline-none bg-white";

  const save = async () => {
    if (!supabase) return;
    if (!f.name.trim() || !f.item.trim()) {
      setErr("اكتب اسم العميل والمطلوب");
      return;
    }
    setBusy(true);
    setErr("");
    const total = Number(f.total) || 0;
    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_no: makeOrderNo(),
        mode: "full",
        source: "manual",
        status: "confirmed",
        items: [{ name: f.item.trim(), qty: Number(f.qty) || 1 }],
        total,
        due: total,
        customer_name: f.name.trim(),
        customer_phone: f.phone.trim() || null,
        company: f.company.trim() || null,
        notes: f.notes.trim() || null,
        due_date: f.due_date || null
      })
      .select("*, payments(*)")
      .single();
    setBusy(false);
    if (error || !data) {
      setErr("ما اتحفظش: " + (error?.message || ""));
      return;
    }
    onCreated(data as Order);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-ink/60 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-5 max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-ink">طلب جديد (يدوي)</h2>
          <button onClick={onClose} className="text-steel text-2xl leading-none px-2" aria-label="إغلاق">×</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className={input} placeholder="اسم العميل *" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input className={input} placeholder="الموبايل" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          <input className={`${input} col-span-2`} placeholder="الجهة / الشركة" value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} />
          <input className={`${input} col-span-2`} placeholder="المطلوب * (مثلًا: يونيفورم أمن بتطريز)" value={f.item} onChange={(e) => setF({ ...f, item: e.target.value })} />
          <input className={input} placeholder="الكمية" inputMode="numeric" value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })} />
          <input className={input} placeholder="الإجمالي (ج)" inputMode="decimal" value={f.total} onChange={(e) => setF({ ...f, total: e.target.value })} />
          <label className="col-span-2 text-xs text-steel">
            ميعاد التسليم
            <input type="date" className={`${input} mt-1`} value={f.due_date} onChange={(e) => setF({ ...f, due_date: e.target.value })} />
          </label>
          <textarea className={`${input} col-span-2`} rows={2} placeholder="ملاحظات (مقاسات، ألوان...)" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
        </div>
        {err && <p className="text-sm text-signal mt-3">{err}</p>}
        <button onClick={save} disabled={busy} className="mt-4 w-full rounded-full bg-royal text-white text-sm font-semibold py-3 disabled:opacity-60">
          {busy ? "..." : "احفظ الطلب"}
        </button>
      </div>
    </div>
  );
}
