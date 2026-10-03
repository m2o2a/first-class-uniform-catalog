import { NextRequest, NextResponse } from "next/server";
import { notifyOwner } from "@/lib/notify";

// Leads from the customizer (type "customizer") and sample requests
// (type "sample"). Forwarded to the Google Sheet + owner's WhatsApp —
// see GOOGLE_SHEET_SETUP.md and WHATSAPP_ALERTS_SETUP.md.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, product, lang, type, company, address, image } = body || {};

    if (!name || !phone) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }

    const isSample = type === "sample";
    const text = isSample
      ? `طلب عينة جديد 📦\nالاسم: ${name}\nالموبايل: ${phone}\nالشركة: ${company || "-"}\nالعنوان: ${address || "-"}\nالمنتج: ${product || "-"}`
      : `عميل جديد من أداة تخصيص المنتج 🧵\nالاسم: ${name}\nالموبايل: ${phone}\nالمنتج: ${product || "-"}`;

    const notified = await notifyOwner(
      {
        source: isSample ? "sample" : "customizer",
        name,
        phone,
        company: company || "",
        address: address || "",
        product: product || "",
        image: image || "",
        lang: lang || ""
      },
      text
    );

    return NextResponse.json({ ok: true, notified });
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
