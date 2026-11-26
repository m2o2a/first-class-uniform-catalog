import { NextRequest, NextResponse } from "next/server";
import { notifyOwner } from "@/lib/notify";
import { makeOrderNo } from "@/lib/orders";
import { supabaseServer } from "@/lib/supabase-server";

type Item = { name: string; src: string; qty: number; type: "ready" | "custom"; logos: number; estimate: number };

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const { customer, items, mode, total, due, lang } = b || {};
    if (!customer?.name || !customer?.phone || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }

    const orderNo = makeOrderNo();

    const modeLabel =
      mode === "full" ? "دفع كامل" : mode === "deposit" ? "عربون 50%" : "طلب عرض سعر";

    const lines = (items as Item[])
      .map(
        (i) =>
          `• ${i.name} × ${i.qty} — ${i.type === "custom" ? `بتطريز (${i.logos} لوجو)` : "جاهز"}`
      )
      .join("\n");

    const text =
      `طلب جديد ${orderNo} 🛒\n` +
      `العميل: ${customer.name}\nالموبايل: ${customer.phone}\n` +
      `الشركة: ${customer.company || "-"}\nالعنوان: ${customer.address || "-"}\n` +
      `النوع: ${modeLabel}\n${lines}\n` +
      (mode === "quote" ? "" : `الإجمالي التقديري: ${total} ج — المطلوب دلوقتي: ${due} ج`);

    const notified = await notifyOwner(
      {
        source: "order",
        orderNo,
        mode,
        name: customer.name,
        phone: customer.phone,
        company: customer.company || "",
        address: customer.address || "",
        notes: customer.notes || "",
        items: lines,
        total: total || 0,
        due: due || 0,
        lang: lang || ""
      },
      text
    );

    const saved = await saveOrder(req, { orderNo, customer, items: items as Item[], mode, total, due });

    return NextResponse.json({ ok: true, orderNo, notified, saved });
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}

// Saves the order to Supabase so it shows up in /admin — guests included.
// If the shopper is signed in, the order is also linked to their account.
async function saveOrder(
  req: NextRequest,
  o: { orderNo: string; customer: Record<string, string>; items: Item[]; mode: string; total: number; due: number }
): Promise<boolean> {
  const db = supabaseServer();
  if (!db) return false;
  try {
    let userId: string | null = null;
    const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (token) {
      const { data } = await db.auth.getUser(token);
      userId = data.user?.id ?? null;
    }
    const { error } = await db.from("orders").insert({
      user_id: userId,
      order_no: o.orderNo,
      mode: ["full", "deposit", "quote"].includes(o.mode) ? o.mode : "quote",
      items: o.items.map(({ name, src, qty, type, logos, estimate }) => ({ name, src, qty, type, logos, estimate })),
      total: Number(o.total) || 0,
      due: Number(o.due) || 0,
      status: "new",
      customer_name: o.customer.name,
      customer_phone: o.customer.phone,
      company: o.customer.company || null,
      address: o.customer.address || null,
      notes: o.customer.notes || null,
      source: "site"
    });
    if (error) console.error("Order save failed", error);
    return !error;
  } catch (e) {
    console.error("Order save failed", e);
    return false;
  }
}
