"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase, useSession } from "@/lib/supabase";
import { Order, isClosed, isLate, remainingOf, statusAr, todayISO } from "@/lib/orders";
import OrderDetail from "@/components/admin/OrderDetail";
import NewOrderForm from "@/components/admin/NewOrderForm";

type Filter = "active" | "late" | "unpaid" | "all" | string;

const money = (n: number) => `${Math.round(n).toLocaleString()} ج`;

const statusColor: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  confirmed: "bg-indigo-50 text-indigo-700",
  in_production: "bg-amber-50 text-amber-700",
  ready: "bg-green-50 text-green-700",
  delivered: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-50 text-red-600"
};

export default function AdminPage() {
  const { session, ready, enabled } = useSession();
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>("active");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!supabase || !session) {
      setAdmin(null);
      return;
    }
    supabase.rpc("is_admin").then(({ data }) => setAdmin(data === true));
  }, [session]);

  const load = () => {
    if (!supabase) return;
    setLoading(true);
    supabase
      .from("orders")
      .select("*, payments(*)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (admin) load();
  }, [admin]);

  const stats = useMemo(() => {
    const month = todayISO().slice(0, 7);
    const live = orders.filter((o) => o.status !== "cancelled");
    return {
      active: orders.filter((o) => !isClosed(o)).length,
      inProduction: orders.filter((o) => o.status === "in_production").length,
      late: orders.filter(isLate).length,
      outstanding: live.reduce((s, o) => s + remainingOf(o), 0),
      collectedThisMonth: live.reduce(
        (s, o) => s + (o.payments || []).filter((p) => p.paid_at.startsWith(month)).reduce((a, p) => a + Number(p.amount), 0),
        0
      )
    };
  }, [orders]);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return orders
      .filter((o) => {
        if (filter === "active") return !isClosed(o);
        if (filter === "late") return isLate(o);
        if (filter === "unpaid") return o.status !== "cancelled" && remainingOf(o) > 0;
        if (filter === "all") return true;
        return o.status === filter;
      })
      .filter(
        (o) =>
          !term ||
          [o.order_no, o.customer_name, o.customer_phone, o.company, o.workshop_name].some((v) => (v || "").toLowerCase().includes(term))
      );
  }, [orders, filter, q]);

  const open = orders.find((o) => o.id === openId) || null;
  const replace = (o: Order) => setOrders((list) => list.map((x) => (x.id === o.id ? o : x)));

  if (!enabled) return <Notice title="Supabase مش متفعّل" body="لازم تضيف مفاتيح Supabase في Vercel الأول — شوف ملف ADMIN_SETUP.md." />;
  if (!ready) return <div className="min-h-[60vh]" />;
  if (!session) return <Login />;
  if (admin === null) return <div className="min-h-[60vh]" />;
  if (!admin)
    return (
      <Notice
        title="الحساب ده مش أدمن"
        body={`داخل بـ ${session.user.email}. علشان تفتح لوحة التحكم، ضيف الحساب ده لجدول admins (الخطوة 4 في ADMIN_SETUP.md).`}
        action={<button onClick={() => supabase!.auth.signOut()} className="text-sm text-royal underline">تسجيل خروج</button>}
      />
    );

  const filters: [Filter, string][] = [
    ["active", "الشغالة"],
    ["late", `متأخرة${stats.late ? ` (${stats.late})` : ""}`],
    ["unpaid", "عليها فلوس"],
    ["new", statusAr.new],
    ["in_production", statusAr.in_production],
    ["ready", statusAr.ready],
    ["delivered", statusAr.delivered],
    ["all", "الكل"]
  ];

  return (
    <section className="bg-paper min-h-screen py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="font-bold text-2xl text-ink">لوحة التحكم</h1>
            <p className="text-xs text-steel">{session.user.email}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="rounded-full border border-line bg-white text-sm px-4 py-2 text-steel hover:text-royal">
              {loading ? "..." : "تحديث"}
            </button>
            <button onClick={() => setAdding(true)} className="rounded-full bg-royal text-white text-sm font-semibold px-5 py-2">
              + طلب جديد
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <Stat label="طلبات شغالة" value={String(stats.active)} />
          <Stat label="في التصنيع" value={String(stats.inProduction)} />
          <Stat label="متأخرة" value={String(stats.late)} danger={stats.late > 0} />
          <Stat label="فلوس برّه (لسه متحصلتش)" value={money(stats.outstanding)} danger={stats.outstanding > 0} />
          <Stat label="اتحصّل الشهر ده" value={money(stats.collectedThisMonth)} good />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث برقم الطلب، الاسم، الموبايل، الشركة، الورشة..."
            className="flex-1 rounded-full border border-line bg-white px-4 py-2.5 text-sm focus:border-royal focus:outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {filters.map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold border ${
                filter === k ? "bg-ink text-white border-ink" : "bg-white border-line text-steel"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <p className="text-center text-steel text-sm py-16">{loading ? "بيحمّل..." : "مفيش طلبات هنا."}</p>
        ) : (
          <div className="space-y-2">
            {shown.map((o) => {
              const remaining = remainingOf(o);
              const late = isLate(o);
              return (
                <button
                  key={o.id}
                  onClick={() => setOpenId(o.id)}
                  className={`w-full text-start rounded-2xl bg-white border p-4 hover:border-royal transition-colors ${late ? "border-signal/50" : "border-line"}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-ink truncate">
                        {o.customer_name || "بدون اسم"}
                        {o.company && <span className="font-normal text-steel"> · {o.company}</span>}
                      </p>
                      <p className="text-xs text-steel">
                        {o.order_no} · {o.customer_phone || "—"} · {new Date(o.created_at).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                    <span className={`text-xs rounded-full px-3 py-1 font-semibold ${statusColor[o.status] || "bg-gray-100"}`}>
                      {statusAr[o.status] || o.status}
                    </span>
                  </div>
                  <p className="text-sm text-ink mt-2 truncate">{(o.items || []).map((it) => `${it.name} × ${it.qty}`).join("، ")}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                    {Number(o.total) > 0 && <span className="text-ink">الإجمالي: <b>{money(Number(o.total))}</b></span>}
                    {remaining > 0 && o.status !== "cancelled" && <span className="text-signal">الباقي: <b>{money(remaining)}</b></span>}
                    {o.due_date && <span className={late ? "text-signal font-bold" : "text-steel"}>التسليم: {o.due_date}{late && " — متأخر"}</span>}
                    {o.production === "workshop" && <span className="text-amber-700">ورشة: {o.workshop_name || "—"}</span>}
                    {o.production === "in_house" && <span className="text-steel">في المصنع</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {open && (
        <OrderDetail
          key={open.id}
          order={open}
          onChange={replace}
          onDelete={(id) => {
            setOrders((list) => list.filter((x) => x.id !== id));
            setOpenId(null);
          }}
          onClose={() => setOpenId(null)}
        />
      )}
      {adding && (
        <NewOrderForm
          onClose={() => setAdding(false)}
          onCreated={(o) => {
            setOrders((list) => [o, ...list]);
            setAdding(false);
            setOpenId(o.id);
          }}
        />
      )}
    </section>
  );
}

function Stat({ label, value, danger, good }: { label: string; value: string; danger?: boolean; good?: boolean }) {
  return (
    <div className="rounded-2xl bg-white border border-line p-4">
      <p className="text-xs text-steel mb-1">{label}</p>
      <p className={`font-bold text-xl ${danger ? "text-signal" : good ? "text-green-700" : "text-ink"}`}>{value}</p>
    </div>
  );
}

function Notice({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-5 bg-paper">
      <div className="max-w-md text-center">
        <h1 className="font-bold text-xl text-ink mb-2">{title}</h1>
        <p className="text-sm text-steel mb-4">{body}</p>
        {action}
      </div>
    </section>
  );
}

function Login() {
  const [f, setF] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const input = "w-full rounded-xl border border-line px-4 py-3 text-sm text-ink focus:border-royal focus:outline-none bg-white";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setErr("");
    const { error } = await supabase.auth.signInWithPassword(f);
    if (error) setErr("الإيميل أو كلمة السر غلط");
    setBusy(false);
  };

  return (
    <section className="min-h-[60vh] flex items-center justify-center px-5 bg-paper">
      <form onSubmit={submit} className="w-full max-w-sm space-y-3">
        <h1 className="font-bold text-xl text-ink text-center mb-2">دخول لوحة التحكم</h1>
        <input className={input} type="email" placeholder="الإيميل" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input className={input} type="password" placeholder="كلمة السر" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        {err && <p className="text-sm text-signal">{err}</p>}
        <button disabled={busy} className="w-full rounded-full bg-royal text-white text-sm font-semibold py-3 disabled:opacity-60">
          {busy ? "..." : "دخول"}
        </button>
      </form>
    </section>
  );
}
