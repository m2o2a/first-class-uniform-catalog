"use client";

import { motion } from "framer-motion";

export default function SectionHeading({
  eyebrow,
  title,
  sub,
  dark = false
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  dark?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-2xl mx-auto text-center mb-12 px-4"
    >
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-[11px] tracking-widest2 font-bold mb-4 ${
          dark ? "border-white/20 text-signal" : "border-line text-signal bg-white"
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
        {eyebrow.toUpperCase()}
      </span>
      <h2
        className={`font-display font-bold text-3xl sm:text-4xl md:text-[2.75rem] leading-tight ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p className={`mt-3 text-sm sm:text-base ${dark ? "text-mist" : "text-steel"}`}>{sub}</p>
      )}
      <div className="flex items-center justify-center gap-1.5 mt-6">
        <span className={`h-[2px] w-10 rounded-full ${dark ? "bg-white/25" : "bg-line"}`} />
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        <span className={`h-[2px] w-10 rounded-full ${dark ? "bg-white/25" : "bg-line"}`} />
      </div>
    </motion.div>
  );
}
