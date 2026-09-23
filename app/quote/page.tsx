"use client";

import { useLang } from "@/lib/lang-context";
import SectionHeading from "@/components/SectionHeading";
import QuoteCalculator from "@/components/QuoteCalculator";

export default function QuotePage() {
  const { lang } = useLang();

  return (
    <section className="py-16 sm:py-24 bg-white min-h-[70vh]">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={lang === "ar" ? "احسب قبل ما تطلب" : "Estimate before you order"}
          title={lang === "ar" ? "احسب سعر طلبك" : "Get your quote"}
          sub={
            lang === "ar"
              ? "اختار العدد والخامة وعدد اللوجوهات، وشوف السعر التقريبي على طول"
              : "Pick quantity, fabric, and logo count to see an instant estimate"
          }
        />
        <QuoteCalculator />
      </div>
    </section>
  );
}
