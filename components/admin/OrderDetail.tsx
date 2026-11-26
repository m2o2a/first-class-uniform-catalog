"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ORDER_STATUSES,
  Order,
  customerWhatsapp,
  isLate,
  modeAr,
  paidOf,
  paymentMethodAr,
  remainingOf,
  statusAr,
  statusMessage,
  todayISO
} from "@/lib/orders";

const SELECT = "*, payments(*)";
const money = (n: number) => `${Number(n || 0).toLocaleString()} ج`;

export default function OrderDetail({
  order,
  onChange,
  onDelete,
  onClose
}: {
  order: Order;
  onChange: (o: Order) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [edit, setEdit] = useState({
    customer_name: order.customer_name || "",
    customer_phone: order.customer_phone || "",
    company: order.company || "",
    address: order.address || "",
    total: String(order.total ?? ""),
    due_date: order.due_date || "",
    production: order.production || "",
    workshop_name: order.workshop_name || "",
    workshop_cost: order.workshop_cost ? String(order.workshop_cost) : "",
    admin_notes: order.admin_notes || ""
  });
  const [pay, setPay] = useState({ amount: "", method: "cash", paid_at: todayISO(), note: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const input = "w-full rounded-xl border border-line px-3 py-2.5 text-sm text-ink focus:border-royal focus:outline-none bg-white";

  const run = async (fn: () => PromiseLike<{ data: unknown; error: { message: string } | null }>, ok: string) => {
    setBusy(true);
    setMsg("");
    const { data, error } = await fn();
    setBusy(false);
    if (error) {
      setMsg("حصل خطأ: " + error.message);
      return false;
    }
    if (data) onChange(data as Order);
    setMsg(ok);
    return true;
  };

  const reload = () => supabase!.from("orders").select(SELECT).eq("id", order.id).single();

  const setStatus = (status: string) =>
    run(() => supabase!.from("orders").update({ status }).eq("id", order.id).select(SELECT).single(), "اتغيرت الحالة ✓");

  const saveDetails = () =>
    run(
      () =>
        supabase!
          .from("orders")
          .update({
            customer_name: edit.customer_name.trim() || null,
            customer_phone: edit.customer_phone.trim() || null,
            company: edit.company.trim() || null,
            address: edit.address.trim() || null,
            total: Number(edit.total) || 0,
            due_date: edit.due_date || null,
            production: edit.production || null,
            workshop_name: edit.production === "workshop" ? edit.workshop_name.trim() || null : null,
            workshop_cost: edit.production === "workshop" ? Number(edit.workshop_cost) || 0 : 0,
            admin_notes: edit.admin_notes.trim() || null
          })
          .eq("id", order.id)
          .select(SELECT)
          .single(),
      "اتحفظ ✓"
    );

  const addPayment = async () => {
    const amount = Number(pay.amount);
    if (!(amount > 0)) {
      setMsg("اكتب المبلغ");
      return;
    }
    const ok = await run(async () => {
      const { error } = await supabase!.from("payments").insert({
        order_id: order.id,
        amount,
        method: pay.method,
        paid_at: pay.paid_at || todayISO(),
        note: pay.note.trim() || null
      });
      return error ? { data: null, error } : reload();
    }, "اتسجلت الدفعة ✓");
    if (ok) setPay({ amount: "", method: "cash", paid_at: todayISO(), note: "" });
  };

  const deletePayment = (id: string) => {
    if (!confirm("تمسح الدفعة دي؟")) return;
    run(async () => {
      const { error } = await supabase!.from("payments").delete().eq("id", id);
      return error ? { data: null, error } : reload();
    }, "اتمسحت ✓");
  };

  const deleteOrder = async () => {
    if (!confirm(`تمسح الطلب ${order.order_no} نهائيًا؟`)) return;
    setBusy(true);
    const { error } = await supabase!.from("orders").delete().eq("id", order.id);
    setBusy(false);
    if (error) setMsg("حصل خطأ: " + error.message);
    else onDelete(order.id);
  };

  const paid = paidOf(order);
  const remaining = remainingOf(order);
  const net = Number(order.total) - Number(order.workshop_cost || 0);

  return (
    <div className="fixed inset-0 z-[60] bg-ink/60 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl max-h-[94vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-line px-5 py-4 flex items-center justify-between z-10">
          <div>
            <p className="font-bold text-ink tracking-wider">{order.order_no}</p>
            <p className="text-xs text-steel">
              {new Date(order.created_at).toLocaleDateString("ar-EG")} · {order.source === "manual" ? "يدوي" : "من الموقع"} · {modeAr[order.mode] || order.mode}
            </p>
          </div>
          <button onClick={onClose} className="text-steel text-2xl leading-none px-2" aria-label="إغلاق">×</button>
        </div>

        <div className="p-5 space-y-6">
          {/* Status */}
          <section>
            <h3 className="text-sm font-bold text-ink mb-2">الحالة {isLate(order) && <span className="text-signal">· متأخر!</span>}</h3>
            <div className="flex flex-wrap gap-2">
              {ORDER_STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={busy || order.status === s}
                  onClick={() => setStatus(s)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border ${
                    order.status === s ? "bg-royal text-white border-royal" : "border-line text-steel hover:border-royal hover:text-royal"
                  }`}
                >
                  {statusAr[s]}
                </button>
              ))}
            </div>
            {order.customer_phone && (
              <a
                href={customerWhatsapp(order.customer_phone, statusMessage(order))}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white text-xs font-semibold px-4 py-2"
              >
                ابعت للعميل واتساب بالحالة
              </a>
            )}
          </section>

          {/* Items */}
          <section>
            <h3 className="text-sm font-bold text-ink mb-2">المطلوب</h3>
            <ul className="text-sm text-ink space-y-1">
              {(order.items || []).map((it, i) => (
                <li key={i}>
                  • {it.name} × {it.qty}
                  {it.type === "custom" && <span className="text-steel"> — بتطريز ({it.logos} لوجو)</span>}
                </li>
              ))}
            </ul>
            {order.notes && <p className="mt-2 text-sm text-steel bg-paper rounded-xl p-3">ملاحظات العميل: {order.notes}</p>}
          </section>

          {/* Money */}
          <section className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-paper p-3">
              <p className="text-xs text-steel">الإجمالي</p>
              <p className="font-bold text-ink">{money(order.total)}</p>
            </div>
            <div className="rounded-2xl bg-paper p-3">
              <p className="text-xs text-steel">اتدفع</p>
              <p className="font-bold text-green-700">{money(paid)}</p>
            </div>
            <div className="rounded-2xl bg-paper p-3">
              <p className="text-xs text-steel">الباقي</p>
              <p className={`font-bold ${remaining > 0 ? "text-signal" : "text-ink"}`}>{money(remaining)}</p>
            </div>
          </section>

          {/* Payments */}
          <section>
            <h3 className="text-sm font-bold text-ink mb-2">الدفعات</h3>
            {(order.payments || []).length === 0 ? (
              <p className="text-xs text-steel mb-2">مفيش دفعات متسجلة.</p>
            ) : (
              <ul className="divide-y divide-line border border-line rounded-xl mb-3">
                {[...(order.payments || [])]
                  .sort((a, b) => a.paid_at.localeCompare(b.paid_at))
                  .map((p) => (
                    <li key={p.id} className="flex items-center justify-between px-3 py-2 text-sm">
                      <span>
                        <b>{money(p.amount)}</b> <span className="text-steel">· {paymentMethodAr[p.method || ""] || p.method || ""} · {p.paid_at}</span>
                        {p.note && <span className="text-steel"> · {p.note}</span>}
                      </span>
                      <button onClick={() => deletePayment(p.id)} disabled={busy} className="text-xs text-steel hover:text-signal">مسح</button>
                    </li>
                  ))}
              </ul>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <input className={input} placeholder="المبلغ" inputMode="decimal" value={pay.amount} onChange={(e) => setPay({ ...pay, amount: e.target.value })} />
              <select className={input} value={pay.method} onChange={(e) => setPay({ ...pay, method: e.target.value })}>
                {Object.entries(paymentMethodAr).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <input type="date" className={input} value={pay.paid_at} onChange={(e) => setPay({ ...pay, paid_at: e.target.value })} />
              <button onClick={addPayment} disabled={busy} className="rounded-xl bg-ink text-white text-sm font-semibold py-2.5 disabled:opacity-60">+ سجّل دفعة</button>
            </div>
          </section>

          {/* Production */}
          <section>
            <h3 className="text-sm font-bold text-ink mb-2">التصنيع</h3>
            <div className="flex gap-2 mb-3">
              {[
                ["in_house", "عندنا في المصنع"],
                ["workshop", "ورشة برّه"]
              ].map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setEdit({ ...edit, production: edit.production === k ? "" : k })}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold ${edit.production === k ? "border-royal bg-royal/5 text-royal" : "border-line text-steel"}`}
                >
                  {v}
                </button>
              ))}
            </div>
            {edit.production === "workshop" && (
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input className={input} placeholder="اسم الورشة" value={edit.workshop_name} onChange={(e) => setEdit({ ...edit, workshop_name: e.target.value })} />
                <input className={input} placeholder="تكلفة الورشة (ج)" inputMode="decimal" value={edit.workshop_cost} onChange={(e) => setEdit({ ...edit, workshop_cost: e.target.value })} />
              </div>
            )}
            {order.production === "workshop" && Number(order.total) > 0 && (
              <p className="text-xs text-steel">
                المكسب بعد الورشة: <b className={net >= 0 ? "text-green-700" : "text-signal"}>{money(net)}</b>
              </p>
            )}
          </section>

          {/* Details */}
          <section>
            <h3 className="text-sm font-bold text-ink mb-2">بيانات الطلب</h3>
            <div className="grid grid-cols-2 gap-2">
              <input className={input} placeholder="اسم العميل" value={edit.customer_name} onChange={(e) => setEdit({ ...edit, customer_name: e.target.value })} />
              <input className={input} placeholder="الموبايل" inputMode="tel" value={edit.customer_phone} onChange={(e) => setEdit({ ...edit, customer_phone: e.target.value })} />
              <input className={input} placeholder="الجهة / الشركة" value={edit.company} onChange={(e) => setEdit({ ...edit, company: e.target.value })} />
              <input className={input} placeholder="العنوان" value={edit.address} onChange={(e) => setEdit({ ...edit, address: e.target.value })} />
              <label className="text-xs text-steel">
                الإجمالي (ج)
                <input className={`${input} mt-1`} inputMode="decimal" value={edit.total} onChange={(e) => setEdit({ ...edit, total: e.target.value })} />
              </label>
              <label className="text-xs text-steel">
                ميعاد التسليم
                <input type="date" className={`${input} mt-1`} value={edit.due_date} onChange={(e) => setEdit({ ...edit, due_date: e.target.value })} />
              </label>
              <textarea className={`${input} col-span-2`} rows={2} placeholder="ملاحظات داخلية (مش بتظهر للعميل)" value={edit.admin_notes} onChange={(e) => setEdit({ ...edit, admin_notes: e.target.value })} />
            </div>
            <button onClick={saveDetails} disabled={busy} className="mt-3 w-full rounded-full bg-royal text-white text-sm font-semibold py-3 disabled:opacity-60">
              {busy ? "..." : "احفظ التعديلات"}
            </button>
          </section>

          {msg && <p className="text-sm text-royal text-center">{msg}</p>}

          <button onClick={deleteOrder} disabled={busy} className="w-full text-xs text-steel hover:text-signal py-2">
            مسح الطلب نهائيًا
          </button>
        </div>
      </div>
    </div>
  );
}
