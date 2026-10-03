// Server-only helper: forwards a record to the Google Sheet webhook and a
// WhatsApp alert via CallMeBot. Both optional (env-gated) and independent.
export async function notifyOwner(sheetRow: Record<string, unknown>, whatsappText: string): Promise<boolean> {
  const webhookUrl = process.env.LEAD_SHEET_WEBHOOK_URL;
  const callmebotPhone = process.env.CALLMEBOT_PHONE;
  const callmebotApiKey = process.env.CALLMEBOT_APIKEY;
  const tasks: Promise<unknown>[] = [];

  if (webhookUrl) {
    tasks.push(
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...sheetRow, date: new Date().toISOString() })
      }).catch((e) => console.error("Sheet webhook failed", e))
    );
  }

  if (callmebotPhone && callmebotApiKey) {
    const url =
      `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(callmebotPhone)}` +
      `&text=${encodeURIComponent(whatsappText)}&apikey=${encodeURIComponent(callmebotApiKey)}`;
    tasks.push(fetch(url).catch((e) => console.error("CallMeBot alert failed", e)));
  }

  if (tasks.length === 0) {
    console.log("New record (no sheet/WhatsApp configured):", sheetRow);
    return false;
  }
  await Promise.all(tasks);
  return true;
}
