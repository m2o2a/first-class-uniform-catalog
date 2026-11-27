# تفعيل حسابات العملاء (Supabase) — 5 دقايق

1. ادخل supabase.com واعمل حساب مجاني، وبعدين **New project** (اختار أقرب منطقة، مثلا Frankfurt).
2. من القائمة الشمال: **SQL Editor** ← الصق محتوى ملف `supabase/schema.sql` ← **Run**.
3. من **Project Settings ← API** انسخ:
   - `Project URL`
   - `anon public` key
4. في Vercel ← مشروع الكتالوج ← **Settings ← Environment Variables** ضيف:
   - `NEXT_PUBLIC_SUPABASE_URL` = الـ Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = الـ anon key
5. اعمل **Redeploy**.

## تغيير حالة الطلب للعميل
من Supabase ← **Table Editor ← orders** غيّر عمود `status` لواحدة من:
`new` (جديد) · `confirmed` (مؤكد) · `in_production` (في التصنيع) · `ready` (جاهز) · `delivered` (اتسلم)
والعميل هيشوف الحالة الجديدة في صفحة "حسابي".

---

> ✅ تم التفعيل (٢٨ نوفمبر ٢٠٢٦): حسابات العملاء شغالة على الموقع — اتعمل مشروع Supabase جديد واتربط بـ Vercel.
