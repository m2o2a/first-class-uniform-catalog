"use client";

import { useLang } from "@/lib/lang-context";
import { sayings } from "@/lib/sayings";

// Slow infinite marquee of short uniform-industry sayings.
export default function SayingsStrip({ dark = false }: { dark?: boolean }) {
  const { lang } = useLang();
  const list = [...sayings, ...sayings];
  return (
    <div className={`relative overflow-hidden py-5 border-y ${dark ? "bg-ink border-white/10" : "bg-paper border-line"}`}>
      <div className={`flex gap-10 w-max ${lang === "ar" ? "animate-marqueeRtl" : "animate-marquee"}`} style={{ animationDuration: "60s" }}>
        {list.map((s, i) => (
          <span key={i} className={`flex items-center gap-10 whitespace-nowrap font-display text-lg sm:text-xl ${dark ? "text-white/80" : "text-ink/80"}`}>
            {lang === "ar" ? s.ar : s.en}
            <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
