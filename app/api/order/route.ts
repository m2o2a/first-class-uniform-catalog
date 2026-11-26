import { NextRequest, NextResponse } from "next/server";
import { notifyOwner } from "@/lib/notify";
import { DEPOSIT_PERCENT } from "@/lib/pricing";

type Item = { name: string; src: string; qty: number; type: "ready" | "custom"; logos: number; estimate: number };

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const { customer, items, mode, total, due, lang } = b || {};
    if (!customer?.name || !customer?.phone || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }

    const d = new Date();
    const orderNo =
      "FC-" +
      String(d.getFullYear()).slice(2) +
      String(d.getMonth() + 1).padStart(2, "0") +
      String(d.getDate()).padStart(2, "0") +
      "-" +
      Math.random().toString(36).slice(2, 6).toUpperCase();

    const modeLabel =
      mode === "full" ? "دفع كامل" : mode === "deposit" ? `عربون ${DEPOSIT_PERCENT}%` : "طلب عرض سعر";

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

    return NextResponse.json({ ok: true, orderNo, notified });
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
