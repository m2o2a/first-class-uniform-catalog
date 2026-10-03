"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useLang } from "@/lib/lang-context";

export default function QuoteFloatButton() {
  const { lang } = useLang();
  const pathname = usePathname();
  if (["/quote", "/cart", "/account"].includes(pathname)) return null;

  return (
    <Link
      href="/quote"
      aria-label={lang === "ar" ? "احسب السعر" : "Get a quote"}
      className="fixed bottom-5 start-5 z-50 flex items-center gap-2 rounded-full bg-gold text-ink shadow-lg shadow-black/20 px-4 py-3 hover:scale-105 transition-transform"
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-gold"
        animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0, 0.35] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
      />
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="relative z-10 flex-shrink-0">
        <path
          d="M9 14l2 2 4-4M12 3l1.5 3 3.3.5-2.4 2.3.6 3.3L12 10.5 9 12.1l.6-3.3L7.2 6.5l3.3-.5L12 3z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="relative z-10 text-xs font-bold whitespace-nowrap">
        {lang === "ar" ? "احسب السعر" : "Get a quote"}
      </span>
    </Link>
  );
}
