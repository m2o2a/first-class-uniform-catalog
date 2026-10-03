"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import ProductCustomizer from "@/components/ProductCustomizer";
import ProductModal from "@/components/ProductModal";

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
  const [modalOpen, setModalOpen] = useState(false);
  const categorySlug = src.split("/")[2] || "";

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
        className="group relative aspect-square rounded-xl overflow-hidden border border-line bg-paper cursor-pointer"
        initial={{ opacity: 0, y: 24, clipPath: "inset(12% 12% 12% 12% round 12px)" }}
        whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 12px)" }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setModalOpen(true)}
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
          <span className="block rounded-full bg-white/85 p-0.5 shadow">
            <Image src="/logo/logo-mark.png" alt="First Class For Uniform" width={26} height={26} />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-2 flex items-end justify-start gap-1.5 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent pt-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <span className="rounded-full bg-white/95 text-ink text-[11px] font-bold px-3 py-1.5 shadow-md">
            {lang === "ar" ? "اطلب" : "Order"}
          </span>
          {customizable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCustomizerOpen(true);
              }}
              className="rounded-full bg-ink/80 text-white text-[11px] font-bold px-3 py-1.5 hover:bg-ink transition-colors shadow-md"
            >
              {lang === "ar" ? "خصّص" : "Customize"}
            </button>
          )}
        </div>
      </motion.div>

      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        src={src}
        name={fallbackLabel}
        categorySlug={categorySlug}
        onCustomize={() => setCustomizerOpen(true)}
      />
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
