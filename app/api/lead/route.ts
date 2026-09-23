import { NextRequest, NextResponse } from "next/server";

// Forwards customizer leads (name + phone + product) to:
//  1) a Google Sheet, via a Google Apps Script Web App webhook
//     (LEAD_SHEET_WEBHOOK_URL) — see /GOOGLE_SHEET_SETUP.md
//  2) Mohamed's own WhatsApp, via the free CallMeBot API
//     (CALLMEBOT_PHONE + CALLMEBOT_APIKEY) — see /WHATSAPP_ALERTS_SETUP.md
// Both are optional and independent — either, both, or neither can be
// configured without breaking the customer-facing flow.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, product, lang } = body || {};

    if (!name || !phone) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }

    const webhookUrl = process.env.LEAD_SHEET_WEBHOOK_URL;
    const callmebotPhone = process.env.CALLMEBOT_PHONE;
    const callmebotApiKey = process.env.CALLMEBOT_APIKEY;

    const tasks: Promise<unknown>[] = [];

    if (webhookUrl) {
      tasks.push(
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            phone,
            product: product || "",
            lang: lang || "",
            source: "customizer",
            date: new Date().toISOString()
          })
        }).catch((e) => console.error("LEAD_SHEET_WEBHOOK_URL forward failed", e))
      );
    }

    if (callmebotPhone && callmebotApiKey) {
      const text =
        `عميل جديد من أداة تخصيص المنتج 🧵\n` +
        `الاسم: ${name}\n` +
        `الموبايل: ${phone}\n` +
        `المنتج: ${product || "-"}`;
      const url =
        `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(callmebotPhone)}` +
        `&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(callmebotApiKey)}`;
      tasks.push(fetch(url).catch((e) => console.error("CallMeBot WhatsApp alert failed", e)));
    }

    if (tasks.length === 0) {
      // Nothing configured yet — log so it's at least visible in Vercel logs.
      console.log("New customizer lead (no sheet/WhatsApp alert configured):", {
        name,
        phone,
        product
      });
    } else {
      await Promise.all(tasks);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
