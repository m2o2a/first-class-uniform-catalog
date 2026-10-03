# ربط الموقع بصفحة الفيس (تكتب مرة — تنزل في الاتنين)

الفكرة: بتكتب البوست في فورم n8n ← بينزل على صفحة فرست كلاس على فيسبوك ←
الموقع بيقرا الصفحة كل 10 دقايق ويعرض البوستات في صفحة **أخبارنا** (/news).
وأي بوست تنزله على الفيس مباشرة من الموبايل برضه هيظهر على الموقع.

## 1) هات رقم الصفحة وتوكن دايم (مرة واحدة — 10 دقايق)
1. ادخل https://developers.facebook.com ← My Apps ← Create App ← نوع **Business**.
2. من Tools ← **Graph API Explorer**: اختار الأبلكيشن، واضغط Get User Access Token
   واختار الصلاحيات: `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`.
3. في خانة الطلب اكتب `me/accounts` واضغط Submit ← هتلاقي صفحة فرست كلاس:
   - `id` = **رقم الصفحة (PAGE_ID)**
   - `access_token` = توكن الصفحة (مؤقت).
4. عشان يبقى دايم: من Tools ← **Access Token Debugger** حط توكن اليوزر واضغط
   **Extend Access Token**، وبعدين كرر خطوة 3 بالتوكن الطويل — توكن الصفحة اللي هيطلع
   **مبيخلصش**.

## 2) حطهم في Vercel
Project ← Settings ← Environment Variables:
- `FB_PAGE_ID` = رقم الصفحة
- `FB_PAGE_TOKEN` = توكن الصفحة الدايم

وبعدين Redeploy. (أو ابعتهملي وأنا أحطهم.)

## 3) n8n
Import للملف `n8n-facebook-post-workflow.json`، افتح نود **الإعدادات** وحط نفس الرقم
والتوكن، وفعّل الـ workflow. لينك الفورم هيظهر في نود "فورم البوست" — احفظه على
موبايلك وانشر منه.
