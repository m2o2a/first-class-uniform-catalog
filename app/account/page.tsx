"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { supabase, useSession } from "@/lib/supabase";
import PageBanner from "@/components/PageBanner";

type Order = { id: string; order_no: string; mode: string; total: number; due: number; status: string; created_at: string; items: { name: string; qty: number }[] };

const statusAr: Record<string, string> = {
  new: "جديد",
  confirmed: "مؤكد",
  in_production: "في التصنيع",
  ready: "جاهز للتسليم",
  delivered: "اتسلم"
};

export default function AccountPage() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const { session, ready, enabled } = useSession();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [f, setF] = useState({ name: "", phone: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!supabase || !session) return;
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as Order[]) || []));
  }, [session]);

  const input = "w-full rounded-xl border border-line px-4 py-3 text-sm text-ink focus:border-royal focus:outline-none";

  const submit = async () => {
    if (!supabase) return;
    setBusy(true);
    setMsg("");
    if (tab === "signup") {
      const { error } = await supabase.auth.signUp({
        email: f.email,
        password: f.password,
        options: { data: { name: f.name, phone: f.phone } }
      });
      setMsg(error ? error.message : ar ? "تم إنشاء الحساب — لو طلب منك تأكيد، افتح الإيميل." : "Account created — check your email if asked to confirm.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: f.email, password: f.password });
      if (error) setMsg(ar ? "الإيميل أو كلمة السر غلط" : "Wrong email or password");
    }
    setBusy(false);
  };

  if (!enabled) {
    return (
      <>
        <PageBanner eyebrow={ar ? "حسابي" : "Account"} title={ar ? "الحسابات قريبًا" : "Accounts coming soon"} />
        <section className="py-16 bg-white text-center px-5">
          <p className="text-steel mb-6">{ar ? "لحد ما نفعّل الحسابات، تقدر تطلب وتتابع على واتساب." : "Until accounts launch, order and follow up on WhatsApp."}</p>
          <Link href="/all-products" className="rounded-full bg-royal text-white text-sm font-semibold px-7 py-3.5">
            {ar ? "تصفح المنتجات" : "Browse products"}
          </Link>
        </section>
      </>
    );
  }

  if (!ready) return <div className="min-h-[50vh]" />;

  if (session) {
    const meta = session.user.user_metadata || {};
    return (
      <>
        <PageBanner eyebrow={ar ? "حسابي" : "My account"} title={ar ? `أهلًا ${meta.name || ""}` : `Welcome ${meta.name || ""}`} sub={session.user.email || ""} />
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-xl text-ink">{ar ? "طلباتي" : "My orders"}</h2>
              <button onClick={() => supabase!.auth.signOut()} className="text-sm text-steel hover:text-signal">
                {ar ? "تسجيل خروج" : "Sign out"}
              </button>
            </div>
            {orders.length === 0 ? (
              <p className="text-steel text-sm">{ar ? "لسه ما عندكش طلبات." : "No orders yet."}</p>
            ) : (
              <div className="space-y-3">
                {orders.map((o, i) => (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl border border-line p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-ink tracking-wider">{o.order_no}</span>
                      <span className="text-xs rounded-full bg-paper border border-line px-3 py-1 text-royal font-semibold">
                        {ar ? statusAr[o.status] || o.status : o.status}
                      </span>
                    </div>
                    <p className="text-xs text-steel mb-2">{new Date(o.created_at).toLocaleDateString(ar ? "ar-EG" : "en-GB")}</p>
                    <p className="text-sm text-ink">{(o.items || []).map((it) => `${it.name} × ${it.qty}`).join("، ")}</p>
                    {o.total > 0 && <p className="text-sm font-bold text-ink mt-2">{o.total.toLocaleString()} {ar ? "ج" : "EGP"}</p>}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageBanner eyebrow={ar ? "حسابي" : "Account"} title={ar ? "ادخل على حسابك" : "Sign in"} sub={ar ? "تابع طلباتك وكررها بضغطة" : "Track and reorder in one tap"} />
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-md px-5">
          <div className="flex rounded-full bg-paper border border-line p-1 mb-6">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative flex-1 rounded-full py-2.5 text-sm font-semibold ${tab === t ? "text-white" : "text-steel"}`}
              >
                {tab === t && <motion.span layoutId="acc-tab" className="absolute inset-0 rounded-full bg-royal" />}
                <span className="relative">{t === "login" ? (ar ? "دخول" : "Sign in") : ar ? "حساب جديد" : "Create account"}</span>
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {tab === "signup" && (
              <>
                <input className={input} placeholder={ar ? "الاسم" : "Name"} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
                <input className={input} placeholder={ar ? "رقم الموبايل" : "Phone"} inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
              </>
            )}
            <input className={input} type="email" placeholder={ar ? "الإيميل" : "Email"} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
            <input className={input} type="password" placeholder={ar ? "كلمة السر (6 حروف على الأقل)" : "Password (6+ chars)"} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
            {msg && <p className="text-sm text-royal">{msg}</p>}
            <button onClick={submit} disabled={busy} className="w-full rounded-full bg-royal text-white text-sm font-semibold py-3.5 disabled:opacity-60">
              {busy ? "..." : tab === "login" ? (ar ? "دخول" : "Sign in") : ar ? "أنشئ الحساب" : "Create account"}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
