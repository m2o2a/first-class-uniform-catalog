"use client";

import Link from "next/link";
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

  return (
    <Link
      href={`/sections/${category.slug}`}
      className="group relative block overflow-hidden rounded-2xl aspect-[4/5] bg-ink"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} fabric-texture opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out`}
      />
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
  );
}
