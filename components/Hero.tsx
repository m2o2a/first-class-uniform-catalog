"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
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

const stack = [
  { src: "/products/hotel/7.jpg", cls: "top-0 end-[8%] w-[46%] rotate-[4deg] z-20", speed: -60 },
  { src: "/products/chef/5.jpg", cls: "top-[18%] start-0 w-[42%] -rotate-[6deg] z-10", speed: -120 },
  { src: "/products/jackets/5.jpg", cls: "bottom-0 end-[22%] w-[44%] rotate-[-2deg] z-30", speed: -30 }
];

function LayeredPhotos() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y0 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : stack[0].speed]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : stack[1].speed]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : stack[2].speed]);
  const ys = [y0, y1, y2];

  return (
    <div ref={ref} className="relative w-full aspect-[5/4] max-w-[560px] mx-auto">
      {stack.map((p, i) => (
        <motion.div key={p.src} style={{ y: ys[i] }} className={`absolute ${p.cls}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.04, rotate: 0, zIndex: 40 }}
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl shadow-black/50 bg-paper"
            >
              <Image src={p.src} alt="" fill sizes="(max-width: 768px) 45vw, 260px" className="object-cover" priority={i === 0} />
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, type: "spring" }}
        className="absolute -bottom-2 start-[6%] z-40 rounded-full bg-gold text-ink text-xs font-bold px-4 py-2 shadow-lg"
      >
        ✦ SINCE 2009
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const { t } = useLang();

  return (
    <section className="relative min-h-[92svh] flex items-center overflow-hidden bg-ink fabric-texture py-16 lg:py-0">
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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
      <div className="text-center lg:text-start">
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
          <span className="inline-flex mx-auto lg:mx-0 mb-8 rounded-3xl bg-white p-3 shadow-2xl shadow-royal/30">
            <Image src="/logo/logo.png" alt="First Class For Uniform" width={104} height={115} priority />
          </span>
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
          className="stitch stitch-light w-24 mx-auto lg:mx-0 my-8"
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
          className="flex flex-wrap items-center justify-center lg:justify-start gap-3"
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
      <LayeredPhotos />
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
