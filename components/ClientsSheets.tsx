"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/lang-context";

// ملخص منظم لملف الشركة (بدل صور الـ PDF)
const values = [
  { ar: "الأشخاص", en: "People", dAr: "بنختار الموهوبين ونحافظ عليهم وندّيهم فرصتهم.", dEn: "We hire, keep and grow talented people." },
  { ar: "الموارد", en: "Resources", dAr: "بنستخدم كل متر خامة صح ونتجنب الهدر.", dEn: "Every metre of fabric used well, no waste." },
  { ar: "التركيز على العميل", en: "Customer focus", dAr: "منتجات مناسبة لاحتياجك وخدمة بأعلى مستوى.", dEn: "Products fitted to your needs, top service." },
  { ar: "الاحترام والإنصاف", en: "Respect & fairness", dAr: "تعامل بنزاهة مع العملاء والشركاء والموظفين.", dEn: "Integrity with clients, partners and staff." },
  { ar: "الجودة", en: "Quality", dAr: "نفس مستوى الجودة في كل قطعة وكل طلبية.", dEn: "The same quality in every piece and order." }
];

const facts = [
  { n: "2009", ar: "سنة البداية", en: "Founded" },
  { n: "+60", ar: "عميل وثق فينا", en: "Clients served" },
  { n: "7", ar: "قطاعات رئيسية", en: "Main sectors" },
  { n: "100%", ar: "تصنيع في مصنعنا", en: "Made in our factory" }
];

export default function ClientsSheets() {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {facts.map((f, i) => (
          <motion.div
            key={f.n}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl bg-white border border-line p-5 text-center"
          >
            <p className="font-display font-bold text-3xl text-royal">{f.n}</p>
            <p className="text-steel text-xs mt-1">{ar ? f.ar : f.en}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl bg-ink text-white p-7 sm:p-10"
      >
        <p className="text-gold text-xs font-bold tracking-widest2 mb-2">{ar ? "قصتنا" : "OUR STORY"}</p>
        <p className="leading-8 text-white/85">
          {ar
            ? "من سنة 2009 وفرست كلاس بتكبر خطوة بخطوة، لحد ما بقت من الشركات الرائدة في اليونيفورم والتوريدات العمومية في مصر. نجاحنا جاي من فريق محترف وعملاء بيرجعولنا تاني، وهدفنا نقدّم يونيفورم بجودة عالية يفوق توقعات عملائنا."
            : "Since 2009 First Class has grown step by step into one of Egypt's leading uniform and general-supplies companies, powered by a skilled team and returning clients. Our goal: quality uniforms that exceed expectations."}
        </p>
        <p className="text-gold text-xs font-bold tracking-widest2 mt-6 mb-2">{ar ? "رؤيتنا" : "OUR VISION"}</p>
        <p className="leading-8 text-white/85">
          {ar
            ? "نكون الأميز في تقديم أفضل حلول اليونيفورم، بجودة عالية وقيمة حقيقية لشركائنا، ونفضل رواد في كفاءة التشغيل والقطاعات اللي بنخدمها."
            : "To be the most distinguished provider of uniform solutions — high quality, real value for partners, and operational excellence."}
        </p>
      </motion.div>

      <div>
        <h3 className="font-display font-bold text-xl text-ink mb-4">{ar ? "قيمنا" : "Our values"}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {values.map((v, i) => (
            <motion.div
              key={v.ar}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl bg-white border border-line p-5"
            >
              <p className="font-bold text-ink">
                <span className="text-gold me-2">✦</span>
                {ar ? v.ar : v.en}
              </p>
              <p className="text-steel text-sm mt-2">{ar ? v.dAr : v.dEn}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
