"use client";

import { motion } from "framer-motion";

export default function PageBanner({
  eyebrow,
  title,
  sub
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <section className="relative py-16 sm:py-20 bg-ink fabric-texture overflow-hidden">
      <motion.div
        className="pointer-events-none absolute -top-32 start-1/3 w-[50vw] h-[50vw] rounded-full bg-royal/25 blur-[120px]"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-1 text-[11px] tracking-widest2 font-bold text-signal mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
          {eyebrow.toUpperCase()}
        </span>
        <h1 className="font-display font-bold text-white text-3xl sm:text-5xl">{title}</h1>
        {sub && <p className="text-mist mt-2 max-w-lg">{sub}</p>}
      </motion.div>
    </section>
  );
}
