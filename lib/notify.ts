// Server-only helper: forwards a record to the Google Sheet webhook and a
// WhatsApp alert via CallMeBot. Both optional (env-gated) and independent.
//
// Guarantees:
//  - NEVER throws (callers can always return a normal response to the customer).
//  - Returns true ONLY if at least one channel confirmed delivery (HTTP 2xx and,
//    for CallMeBot, no error text in the body). When it returns false the cart
//    shows the customer the "send your order on WhatsApp" fallback, so a false
//    negative is safe but a false positive loses the order.
//  - Logs a clear [notifyOwner] line for every missing env var and every failure,
//    visible in Vercel → Project → Logs.
//
// Env vars (see SETUP-ORDERS.md):
//   LEAD_SHEET_WEBHOOK_URL  Google Apps Script web-app URL (…/exec)
//   CALLMEBOT_PHONE         e.g. 201149631070 (international, no +)
//   CALLMEBOT_APIKEY        key CallMeBot sends you on WhatsApp

const TIMEOUT_MS = 8000;
// CallMeBot rejects very long GET URLs; keep the text well under its limit.
const WHATSAPP_MAX_CHARS = 1500;

type ChannelResult = { channel: "sheet" | "whatsapp"; ok: boolean; detail: string };

async function sendToSheet(url: string, row: Record<string, unknown>): Promise<ChannelResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      // text/plain avoids a CORS preflight and is what Apps Script parses most reliably.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...row, date: new Date().toISOString() }),
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS)
    });
    const body = (await res.text().catch(() => "")).slice(0, 300);
    if (!res.ok) return { channel: "sheet", ok: false, detail: `HTTP ${res.status}: ${body}` };
    // The script in SETUP-ORDERS.md answers {"status":"ok"}. An HTML page usually
    // means the deployment isn't public ("Who has access" must be "Anyone").
    if (/<html/i.test(body) && !/"status"\s*:\s*"ok"/.test(body)) {
      return { channel: "sheet", ok: false, detail: `Unexpected HTML response (check deployment access = Anyone): ${body.slice(0, 120)}` };
    }
    return { channel: "sheet", ok: true, detail: `HTTP ${res.status}` };
  } catch (e) {
    return { channel: "sheet", ok: false, detail: String(e) };
  }
}

async function sendWhatsApp(phone: string, apiKey: string, text: string): Promise<ChannelResult> {
  try {
    const digits = phone.replace(/\D/g, "");
    const msg = text.length > WHATSAPP_MAX_CHARS ? text.slice(0, WHATSAPP_MAX_CHARS) + "…" : text;
    const url =
      `https://api.callmebot.com/whatsapp.php?phone=%2B${digits}` +
      `&text=${encodeURIComponent(msg)}&apikey=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    const body = (await res.text().catch(() => "")).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300);
    // CallMeBot sometimes answers 200 with an error message in the body.
    if (!res.ok || /error|invalid|not allowed|wrong/i.test(body)) {
      return { channel: "whatsapp", ok: false, detail: `HTTP ${res.status}: ${body}` };
    }
    return { channel: "whatsapp", ok: true, detail: `HTTP ${res.status}` };
  } catch (e) {
    return { channel: "whatsapp", ok: false, detail: String(e) };
  }
}

export async function notifyOwner(sheetRow: Record<string, unknown>, whatsappText: string): Promise<boolean> {
  try {
    const webhookUrl = process.env.LEAD_SHEET_WEBHOOK_URL?.trim();
    const callmebotPhone = process.env.CALLMEBOT_PHONE?.trim();
    const callmebotApiKey = process.env.CALLMEBOT_APIKEY?.trim();
    const tag = `[notifyOwner ${String(sheetRow.source ?? "")} ${String(sheetRow.orderNo ?? sheetRow.phone ?? "")}]`;

    const tasks: Promise<ChannelResult>[] = [];

    if (webhookUrl) tasks.push(sendToSheet(webhookUrl, sheetRow));
    else console.warn(`${tag} LEAD_SHEET_WEBHOOK_URL is not set — Google Sheet skipped.`);

    if (callmebotPhone && callmebotApiKey) tasks.push(sendWhatsApp(callmebotPhone, callmebotApiKey, whatsappText));
    else {
      const missing = [!callmebotPhone && "CALLMEBOT_PHONE", !callmebotApiKey && "CALLMEBOT_APIKEY"].filter(Boolean).join(", ");
      console.warn(`${tag} ${missing} not set — WhatsApp alert skipped.`);
    }

    if (tasks.length === 0) {
      // Last-resort record: the data is at least in Vercel logs.
      console.error(`${tag} NO notification channel configured. Record:`, JSON.stringify(sheetRow));
      return false;
    }

    const results = await Promise.all(tasks);
    for (const r of results) {
      if (r.ok) console.log(`${tag} ${r.channel} OK (${r.detail})`);
      else console.error(`${tag} ${r.channel} FAILED: ${r.detail}`);
    }
    const anyOk = results.some((r) => r.ok);
    if (!anyOk) console.error(`${tag} all channels failed. Record:`, JSON.stringify(sheetRow));
    return anyOk;
  } catch (e) {
    console.error("[notifyOwner] unexpected error", e, JSON.stringify(sheetRow));
    return false;
  }
}
