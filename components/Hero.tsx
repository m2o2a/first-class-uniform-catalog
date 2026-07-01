"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { whatsappLink, telLink, phones } from "@/lib/contact";

export default function Hero() {
  const { t } = useLang();

  return (
    <section className="relative min-h-[92svh] flex items-center justify-center overflow-hidden bg-ink fabric-texture">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-40 start-1/2 -translate-x-1/2 w-[70vw] h-[70vw] rounded-full bg-royal/25 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 end-0 w-[40vw] h-[40vw] rounded-full bg-signal/15 blur-[120px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center animate-reveal">
        <p className="text-signal text-xs sm:text-sm tracking-widest2 font-bold mb-8">
          {t.hero.eyebrow.toUpperCase()}
        </p>

        <Image
          src="/logo/logo.png"
          alt="First Class For Uniform"
          width={120}
          height={120}
          className="mx-auto mb-8"
          priority
        />

        <h1 className="font-display font-bold text-white leading-[0.95] text-4xl sm:text-6xl md:text-7xl">
          {t.hero.title1}
          <span className="block text-mist text-2xl sm:text-3xl md:text-4xl mt-2 tracking-widest2 font-medium">
            {t.hero.title2}
          </span>
        </h1>

        <hr className="stitch stitch-light w-24 mx-auto my-8" />

        <p className="text-mist text-base sm:text-lg mb-10">{t.hero.tagline}</p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/sections"
            className="rounded-full bg-white text-ink font-semibold text-sm px-7 py-3.5 hover:bg-mist transition-colors"
          >
            {t.hero.browse}
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#25D366] text-white font-semibold text-sm px-7 py-3.5 hover:opacity-90 transition-opacity"
          >
            {t.hero.whatsapp}
          </a>
          <a
            href={telLink(phones[0])}
            className="rounded-full border border-white/30 text-white font-semibold text-sm px-7 py-3.5 hover:bg-white/10 transition-colors"
          >
            {t.hero.call}
          </a>
        </div>
      </div>

      <div className="absolute bottom-6 start-1/2 -translate-x-1/2 text-white/40 text-[10px] tracking-widest2">
        SCROLL
      </div>
    </section>
  );
}
