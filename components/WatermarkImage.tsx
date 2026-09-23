"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import ProductCustomizer from "@/components/ProductCustomizer";

export default function WatermarkImage({
  src,
  alt,
  fallbackLabel,
  customizable = true
}: {
  src: string;
  alt: string;
  fallbackLabel: string;
  customizable?: boolean;
}) {
  const { lang } = useLang();
  const [errored, setErrored] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);

  if (errored) {
    return (
      <div className="aspect-square rounded-xl bg-paper border border-line flex items-center justify-center overflow-hidden fabric-texture">
        <span className="text-steel/50 text-xs text-center px-2">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="group relative aspect-square rounded-xl overflow-hidden border border-line bg-paper"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          onError={() => setErrored(true)}
        />
        {/* Elegant corner watermark — real logo, applied automatically to every product photo */}
        <div className="absolute bottom-2 end-2 opacity-85 z-10">
          <Image
            src="/logo/logo.png"
            alt="First Class For Uniform"
            width={34}
            height={34}
            className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
          />
        </div>

        {customizable && (
          <div className="absolute inset-0 flex items-end justify-start p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-ink/50 via-transparent to-transparent">
            <button
              onClick={() => setCustomizerOpen(true)}
              className="rounded-full bg-white/95 text-ink text-[11px] font-bold px-3 py-1.5 hover:bg-white transition-colors shadow-md flex items-center gap-1.5"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3v18M3 12h18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  transform="rotate(45 12 12)"
                />
              </svg>
              {lang === "ar" ? "خصّص" : "Customize"}
            </button>
          </div>
        )}
      </motion.div>

      {customizable && (
        <ProductCustomizer
          src={src}
          productName={fallbackLabel}
          open={customizerOpen}
          onClose={() => setCustomizerOpen(false)}
        />
      )}
    </>
  );
}
