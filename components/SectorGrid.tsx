"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { sectors } from "@/lib/sectors";

export default function SectorGrid({ compact = false }: { compact?: boolean }) {
  const { t, lang } = useLang();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {sectors.map((s, i) => (
        <motion.div
          key={s.key}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: i * 0.04, ease: "easeOut" }}
        >
          <Link
            href="/projects"
            className="group relative rounded-xl border border-line bg-paper p-5 flex flex-col justify-between h-32 overflow-hidden hover:border-royal hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <span className="text-xs text-signal font-bold tracking-widest2">{s.count}</span>
            <span className="font-display font-bold text-ink text-sm sm:text-base leading-tight">
              {t.sectorNames[s.key]}
            </span>
            <span className="absolute -bottom-6 -end-6 w-16 h-16 rounded-full bg-royal/5 group-hover:bg-royal/10 group-hover:scale-125 transition-all duration-500" />
          </Link>
        </motion.div>
      ))}
      {!compact && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: sectors.length * 0.04, ease: "easeOut" }}
        >
          <Link
            href="/contact"
            className="rounded-xl bg-ink text-white p-5 flex flex-col justify-center items-center h-32 text-center hover:bg-royal hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <span className="font-display font-bold text-sm">
              {lang === "ar" ? "قطاعك مش موجود؟ كلمنا" : "Sector not listed? Talk to us"}
            </span>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
