# Make orders reach you (Google Sheet + WhatsApp)

Every order (`/api/order`), sample request and customizer lead (`/api/lead`) calls
`notifyOwner()` in `lib/notify.ts`. It sends the record to:

1. **Google Sheet**, through an Apps Script web app (`LEAD_SHEET_WEBHOOK_URL`)
2. **Your WhatsApp**, through CallMeBot (`CALLMEBOT_PHONE` + `CALLMEBOT_APIKEY`)

The two channels are independent. If neither one confirms delivery, the customer gets a
**"Send order on WhatsApp"** button as a fallback, and the full record is written to the
Vercel logs (look for `[notifyOwner`). A missing or wrong env var never breaks checkout.

---

## 1) Google Sheet webhook (about 5 min)

1. Create a new Google Sheet, e.g. "طلبات فرست كلاس".
2. **Extensions → Apps Script**. Delete everything and paste:

```javascript
// First Class — order/lead webhook. Orders → "Orders" tab, everything else → "Leads".
const COLUMNS = [
  "date", "source", "orderNo", "mode", "name", "phone", "company", "address",
  "items", "total", "due", "notes", "product", "image", "lang"
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const tabName = data.source === "order" ? "Orders" : "Leads";
    const sheet = ss.getSheetByName(tabName) || ss.insertSheet(tabName);
    if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);

    const row = COLUMNS.map(function (k) {
      let v = data[k] === undefined || data[k] === null ? "" : data[k];
      if (k === "date" && !v) v = new Date().toISOString();
      // Keep the leading 0 of Egyptian numbers (01xxxxxxxxx).
      if (k === "phone" && v) v = "'" + v;
      return v;
    });
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

3. Save, then **Deploy → New deployment → ⚙ → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** (if you pick anything else the site gets an HTML login page and the log says `check deployment access = Anyone`)
4. Authorize, then copy the URL that ends in `/exec`. That URL is `LEAD_SHEET_WEBHOOK_URL`.

> If you edit the script later, use **Deploy → Manage deployments → Edit → Version: New version**.
> If you create a *new* deployment instead, the URL changes and you must update it in Vercel.

> This replaces the script in `GOOGLE_SHEET_SETUP.md`. That one saved only 5 columns, so order
> number, items, totals and address were thrown away.

---

## 2) CallMeBot WhatsApp alert (about 2 min)

1. On the phone that uses WhatsApp number **+20 114 963 1070**, save this contact: **+34 644 59 71 67**
   (check https://www.callmebot.com/blog/free-api-whatsapp-messages/ in case they changed the number).
2. Send it exactly: `I allow callmebot to send me messages`
3. You'll get a reply with your **API key**. That key is `CALLMEBOT_APIKEY`.
4. Test it in a browser (put your key in place of `YOUR_KEY`):
   `https://api.callmebot.com/whatsapp.php?phone=%2B201149631070&text=test&apikey=YOUR_KEY`

---

## 3) The 3 env vars to add in Vercel

Vercel → project **first-class-uniform-catalog** → **Settings → Environment Variables**.
Tick **Production** and **Preview** for each one:

| Name | Value |
|---|---|
| `LEAD_SHEET_WEBHOOK_URL` | `https://script.google.com/macros/s/…/exec` (from step 1) |
| `CALLMEBOT_PHONE` | `201149631070` |
| `CALLMEBOT_APIKEY` | the key from step 2 |

Then go to **Deployments → latest → ⋯ → Redeploy**. Env vars only take effect after a redeploy.

## 4) Verify

Place a test order on the site and check:
- the confirmation screen does **not** show "Last step: tap below to send your order on WhatsApp" (that message means no channel confirmed delivery)
- a new row appears in the **Orders** tab, and the WhatsApp message arrives
- Vercel → **Logs** shows `[notifyOwner order FC-…] sheet OK` and `whatsapp OK`. If you see `FAILED`, the line says why.
