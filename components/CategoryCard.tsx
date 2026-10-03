"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { Category } from "@/lib/categories";

const gradients = [
  "from-royal to-ink",
  "from-signal to-ink",
  "from-ink to-royal",
  "from-steel to-ink"
];

export default function CategoryCard({ category, index }: { category: Category; index: number }) {
  const { lang } = useLang();
  const gradient = gradients[index % gradients.length];
  const [photos, setPhotos] = useState([1, 2, 3, 4]);
  const [cur, setCur] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });

  useEffect(() => {
    if (photos.length < 2 || !inView) return;
    let iv: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      iv = setInterval(() => setCur((c) => (c + 1) % photos.length), 3200);
    }, (index % 6) * 450);
    return () => {
      clearTimeout(start);
      if (iv) clearInterval(iv);
    };
  }, [photos.length, index, inView]);

  const drop = (n: number) => {
    setPhotos((p) => p.filter((x) => x !== n));
    setCur(0);
  };
  const shown = photos.length ? photos[cur % photos.length] : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 8) * 0.05, ease: "easeOut" }}
    >
    <Link
      href={`/sections/${category.slug}`}
      className="group relative block overflow-hidden rounded-2xl aspect-[4/5] bg-ink"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} fabric-texture opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out`}
      />
      <AnimatePresence initial={false}>
        {shown && (
          <motion.div
            key={shown}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <Image
              src={`/products/${category.slug}/${shown}.jpg`}
              alt={lang === "ar" ? category.ar : category.en}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              onError={() => drop(shown)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="relative h-full flex flex-col justify-end p-5">
        <span className="text-[10px] tracking-widest2 text-white/60 font-semibold mb-1">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="text-white font-display font-bold text-lg leading-tight">
          {lang === "ar" ? category.ar : category.en}
        </h3>
        <p className="text-white/60 text-xs mt-1">
          {lang === "ar" ? category.descAr : category.descEn}
        </p>
      </div>
      <div className="absolute top-4 end-4 w-8 h-8 rounded-full border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
    </motion.div>
  );
}
