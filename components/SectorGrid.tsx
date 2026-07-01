"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { sectors } from "@/lib/sectors";

export default function SectorGrid({ compact = false }: { compact?: boolean }) {
  const { t, lang } = useLang();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {sectors.map((s) => (
        <Link
          key={s.key}
          href="/projects"
          className="group relative rounded-xl border border-line bg-paper p-5 flex flex-col justify-between h-32 overflow-hidden hover:border-royal transition-colors"
        >
          <span className="text-xs text-signal font-bold tracking-widest2">{s.count}</span>
          <span className="font-display font-bold text-ink text-sm sm:text-base leading-tight">
            {t.sectorNames[s.key]}
          </span>
          <span className="absolute -bottom-6 -end-6 w-16 h-16 rounded-full bg-royal/5 group-hover:bg-royal/10 transition-colors" />
        </Link>
      ))}
      {!compact && (
        <Link
          href="/contact"
          className="rounded-xl bg-ink text-white p-5 flex flex-col justify-center items-center h-32 text-center hover:bg-royal transition-colors"
        >
          <span className="font-display font-bold text-sm">
            {lang === "ar" ? "قطاعك مش موجود؟ كلمنا" : "Sector not listed? Talk to us"}
          </span>
        </Link>
      )}
    </div>
  );
}
