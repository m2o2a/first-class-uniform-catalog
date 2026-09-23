"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { whatsappLink, telLink, phones } from "@/lib/contact";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] as const }
  })
};

export default function Hero() {
  const { t } = useLang();

  return (
    <section className="relative min-h-[92svh] flex items-center justify-center overflow-hidden bg-ink fabric-texture">
      {/* ambient glow — subtly animated */}
      <motion.div
        className="pointer-events-none absolute -top-40 start-1/2 -translate-x-1/2 w-[70vw] h-[70vw] rounded-full bg-royal/25 blur-[140px]"
        animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.06, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 end-0 w-[40vw] h-[40vw] rounded-full bg-signal/15 blur-[120px]"
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* drifting fabric particles for a touch of motion/tech */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30"
            style={{ left: `${12 + i * 15}%`, top: `${20 + (i % 3) * 22}%` }}
            animate={{ y: [0, -18, 0], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="text-signal text-xs sm:text-sm tracking-widest2 font-bold mb-8"
        >
          {t.hero.eyebrow.toUpperCase()}
        </motion.p>

        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}>
          <Image
            src="/logo/logo.png"
            alt="First Class For Uniform"
            width={120}
            height={120}
            className="mx-auto mb-8"
            priority
          />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="font-display font-bold text-white leading-[0.95] text-4xl sm:text-6xl md:text-7xl"
        >
          {t.hero.title1}
          <span className="block text-mist text-2xl sm:text-3xl md:text-4xl mt-2 tracking-widest2 font-medium">
            {t.hero.title2}
          </span>
        </motion.h1>

        <motion.hr
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="stitch stitch-light w-24 mx-auto my-8"
        />

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          className="text-mist text-base sm:text-lg mb-10"
        >
          {t.hero.tagline}
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={5}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/sections"
            className="rounded-full bg-white text-ink font-semibold text-sm px-7 py-3.5 hover:bg-mist transition-all hover:scale-105"
          >
            {t.hero.browse}
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#25D366] text-white font-semibold text-sm px-7 py-3.5 hover:opacity-90 transition-all hover:scale-105"
          >
            {t.hero.whatsapp}
          </a>
          <a
            href={telLink(phones[0])}
            className="rounded-full border border-white/30 text-white font-semibold text-sm px-7 py-3.5 hover:bg-white/10 transition-all hover:scale-105"
          >
            {t.hero.call}
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-6 start-1/2 -translate-x-1/2 text-white/40 text-[10px] tracking-widest2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        SCROLL
      </motion.div>
    </section>
  );
}
