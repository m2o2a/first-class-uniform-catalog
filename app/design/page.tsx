"use client";

import { useState } from "react";
import Image from "next/image";
import { useLang } from "@/lib/lang-context";
import PageBanner from "@/components/PageBanner";
import ProductCustomizer from "@/components/ProductCustomizer";
import { TEMPLATE_COUNT, templateSrc } from "@/lib/templates";

export default function DesignPage() {
  const { lang } = useLang();
  const [pick, setPick] = useState<number | null>(null);
  const ids = Array.from({ length: TEMPLATE_COUNT }, (_, i) => i + 1);

  return (
    <>
      <PageBanner
        eyebrow={lang === "ar" ? "صمم بنفسك" : "Design yours"}
        title={lang === "ar" ? "صمم اليونيفورم بنفسك" : "Design your uniform"}
        sub={
          lang === "ar"
            ? "اختار الموديل، لوّنه باللون اللي يعجبك، وحط لوجو شركتك — وابعتلنا التصميم على واتساب"
            : "Pick a style, colour it, add your logo — then send us the design on WhatsApp"
        }
      />
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {ids.map((i) => (
            <button
              key={i}
              onClick={() => setPick(i)}
              className="group bg-white rounded-xl border border-line hover:border-royal hover:shadow-lg transition p-2 aspect-[4/5] relative"
              aria-label={`model ${i}`}
            >
              <Image src={templateSrc(i)} alt="" fill sizes="200px" className="object-contain p-2 group-hover:scale-105 transition" />
            </button>
          ))}
        </div>
      </section>
      {pick && (
        <ProductCustomizer
          template
          src={templateSrc(pick)}
          productName={lang === "ar" ? `تصميم ${pick}` : `Design ${pick}`}
          open={pick !== null}
          onClose={() => setPick(null)}
        />
      )}
    </>
  );
}
