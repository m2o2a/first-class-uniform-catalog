# تحليل الزوار — مجاني ومن غير سيرفر

## 1) Vercel Analytics + Speed Insights (أرقام الزيارات والسرعة)
في Vercel ← مشروع الكتالوج ← تبويب **Analytics** ← **Enable**، وكمان **Speed Insights** ← **Enable**.
الكود متركب في الموقع بالفعل، مش محتاج حاجة تانية.

## 2) Microsoft Clarity (فيديوهات لحركة كل زائر + خريطة حرارية)
1. ادخل clarity.microsoft.com وسجّل بحساب مايكروسوفت أو جوجل.
2. **New project** ← اكتب رابط الموقع.
3. هيديك **Project ID** (حروف وأرقام قصيرة، موجود في Settings ← Overview).
4. في Vercel ← Environment Variables ضيف:
   `NEXT_PUBLIC_CLARITY_ID` = الـ Project ID
5. **Redeploy**. بعد ساعتين هتبدأ تشوف تسجيلات الزوار في Clarity ← Recordings.
