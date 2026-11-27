# Make orders reach you (Google Sheet + email to Instinct + WhatsApp)

Every order (`/api/order`), sample request and customizer lead (`/api/lead`) calls
`notifyOwner()` in `lib/notify.ts`. It sends the record to:

1. **Google Sheet**, through an Apps Script web app (`LEAD_SHEET_WEBHOOK_URL`).
   The script below also **emails every record to Instinct**, which relays it to
   your WhatsApp instantly - so orders reach you even before CallMeBot is set up.
2. **Your WhatsApp directly**, through CallMeBot (`CALLMEBOT_PHONE` + `CALLMEBOT_APIKEY`),
   whenever CallMeBot issues you an API key.

The channels are independent. If neither one confirms delivery, the customer gets a
**"Send order on WhatsApp"** button as a fallback, and the full record is written to the
Vercel logs (look for `[notifyOwner`). A missing or wrong env var never breaks checkout.

---

## 1) Google Sheet webhook + email relay (about 5 min)

1. Open the sheet "First Class - Orders & Leads" (or create a new Google Sheet).
2. **Extensions → Apps Script**. Delete everything and paste:

```javascript
// First Class — order/lead webhook. Orders → "Orders" tab, everything else → "Leads",
// and every record is emailed to Instinct for an instant WhatsApp relay.
var COLUMNS = [
  "date", "source", "orderNo", "mode", "name", "phone", "company", "address",
  "items", "total", "due", "notes", "product", "image", "lang"
];
var NOTIFY_EMAIL = "akbwpv@mail.instinct.com";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse(e.postData.contents || "{}");
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var tabName = data.source === "order" ? "Orders" : "Leads";
    var sheet = ss.getSheetByName(tabName) || ss.insertSheet(tabName);
    if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);

    var row = COLUMNS.map(function (k) {
      var v = data[k] === undefined || data[k] === null ? "" : data[k];
      if (k === "date" && !v) v = new Date().toISOString();
      // Keep the leading 0 of Egyptian numbers (01xxxxxxxxx).
      if (k === "phone" && v) v = "'" + v;
      return v;
    });
    sheet.appendRow(row);

    // Email the full record to Instinct for the WhatsApp relay.
    var isOrder = data.source === "order";
    var subject = "[First Class] " + (isOrder ? "order " : "lead ") +
      (data.orderNo || data.product || "") + " - " + (data.name || "") +
      " " + (data.phone || "");
    var body = COLUMNS.map(function (k) {
      var v = data[k] === undefined || data[k] === null ? "" : data[k];
      return k + ": " + v;
    }).join("\n");
    try {
      MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
    } catch (mailErr) {
      // The sheet row is already saved; never fail checkout because of email.
      console.error("email failed: " + mailErr);
    }

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
4. Authorize. It will ask for **Sheets** and **Send email** permissions - both expected.
   Then copy the URL that ends in `/exec`. That URL is `LEAD_SHEET_WEBHOOK_URL`.

> If you edit the script later, use **Deploy → Manage deployments → Edit → Version: New version**.
> If you create a *new* deployment instead, the URL changes and you must update it in Vercel.

> This replaces the script in `GOOGLE_SHEET_SETUP.md`. That one saved only 5 columns, so order
> number, items, totals and address were thrown away.

---

## 2) CallMeBot WhatsApp alert (about 2 min, whenever CallMeBot issues keys)

1. On the phone that uses WhatsApp number **+20 114 963 1070**, save this contact: **+34 644 59 71 67**
   (check https://www.callmebot.com/blog/free-api-whatsapp-messages/ in case they changed the number).
2. Send it exactly: `I allow callmebot to send me messages`
3. You'll get a reply with your **API key**. That key is `CALLMEBOT_APIKEY`.
4. Test it in a browser (put your key in place of `YOUR_KEY`):
   `https://api.callmebot.com/whatsapp.php?phone=%2B201149631070&text=test&apikey=YOUR_KEY`

---

## 3) The env vars to add in Vercel

Vercel → project **first-class-uniform-catalog** → **Settings → Environment Variables**.
Tick **Production** and **Preview** for each one:

| Name | Value |
|---|---|
| `LEAD_SHEET_WEBHOOK_URL` | `https://script.google.com/macros/s/…/exec` (from step 1) |
| `CALLMEBOT_PHONE` | `201149631070` |
| `CALLMEBOT_APIKEY` | the key from step 2 (add it when CallMeBot sends it) |

Then go to **Deployments → latest → ⋯ → Redeploy**. Env vars only take effect after a redeploy.

## 4) Verify

Place a test order on the site and check:
- the confirmation screen does **not** show "Last step: tap below to send your order on WhatsApp" (that message means no channel confirmed delivery)
- a new row appears in the **Orders** tab, the email reaches Instinct (which WhatsApps you), and the direct WhatsApp message arrives once CallMeBot is set
- Vercel → **Logs** shows `[notifyOwner order FC-…] sheet OK` and `whatsapp OK`. If you see `FAILED`, the line says why.
