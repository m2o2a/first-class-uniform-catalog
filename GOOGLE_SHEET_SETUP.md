# ربط أداة "خصص المنتج" بجدول جوجل شيت (Google Sheet)

خطوات لمرة واحدة بس، وبعدها أي عميل يعمل تصميم بلوجوه ويحاول يحمّله أو يبعته واتساب، هيتطلب منه يكتب اسمه ورقم موبايله الأول، والبيانات دي هتتسجل تلقائي في شيت عندك.

## 1) اعمل Google Sheet جديد
افتح https://sheets.google.com واعمل شيت فاضي، وسمّيه مثلاً "عملاء التخصيص - First Class".

في أول صف (Row 1) اكتب العناوين دي بالترتيب:

```
التاريخ | الاسم | رقم الموبايل | المنتج | اللغة
```

## 2) افتح محرر السكريبتات
من داخل الشيت: **Extensions (إضافات) → Apps Script**

امسح أي كود موجود، والصقه بالكود ده:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.date || new Date().toISOString(),
    data.name || "",
    data.phone || "",
    data.product || "",
    data.lang || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

احفظ (Ctrl+S) وسمّي المشروع أي اسم.

## 3) انشر (Deploy) كـ Web App
من فوق يمين: **Deploy → New deployment**

- اضغط على أيقونة الترس بجانب "Select type" واختار **Web app**
- Execute as: **Me**
- Who has access: **Anyone**
- اضغط **Deploy**

هيطلب منك تصريح صلاحيات (Authorize access) — وافق بحسابك.

بعد النشر هيديك رابط شكله كده:
```
https://script.google.com/macros/s/AKfycb.../exec
```

انسخ الرابط ده كامل.

## 4) ضيف الرابط في إعدادات الموقع على Vercel
1. ادخل مشروع الموقع على vercel.com
2. **Settings → Environment Variables**
3. ضيف متغير جديد:
   - Name: `LEAD_SHEET_WEBHOOK_URL`
   - Value: الرابط اللي نسخته فوق
4. احفظ، وبعدين اعمل **Redeploy** للموقع عشان المتغير يتفعّل.

بعد كده، أي عميل يحاول يحمّل أو يبعت تصميمه من أداة "خصّص" هيتطلب منه اسمه ورقمه الأول، وهتلاقي البيانات نازلة أوتوماتيك في الشيت بتاعك.

> ملاحظة: لو مفيش رابط متظبط لسه، الموقع هيكمل يشتغل عادي (العميل يقدر يحمّل صورته) بس البيانات مش هتتسجل حد فين، ولا هيحصل أي خطأ يوقف الموقع.
