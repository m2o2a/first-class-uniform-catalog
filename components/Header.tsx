"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { t, lang, toggle } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { count } = useCart();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/sections", label: t.nav.sections },
    { href: "/all-products", label: t.nav.allProducts },
    { href: "/quote", label: t.nav.quote },
    { href: "/design", label: lang === "ar" ? "صمم بنفسك" : "Design yours" },
    { href: "/guide", label: lang === "ar" ? "دليل الشراء" : "Buying guide" },
    { href: "/news", label: lang === "ar" ? "أخبارنا" : "News" },
    { href: "/projects", label: t.nav.projects },
    { href: "/clients", label: t.nav.clients },
    { href: "/contact", label: t.nav.contact }
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? "glass border-white/10" : "bg-ink border-transparent"
      }`}
    >
      <motion.div
        className="absolute bottom-0 start-0 h-[2px] bg-gradient-to-r from-signal via-gold to-royal origin-left"
        style={{ scaleX: progress, width: "100%" }}
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md transition-transform duration-300 group-hover:rotate-[8deg]">
            <Image src="/logo/logo-mark.png" alt="First Class For Uniform" width={30} height={30} priority />
          </span>
          <span className="text-white font-display font-bold tracking-wide text-sm sm:text-base">
            FIRST CLASS
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative text-sm font-medium transition-colors py-1 ${
                  active ? "text-white" : "text-mist hover:text-white"
                }`}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 start-0 end-0 h-[2px] bg-signal rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/account" aria-label="Account" className="text-white/80 hover:text-white p-1.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
              <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative text-white/80 hover:text-white p-1.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="20" r="1.4" fill="currentColor" />
              <circle cx="17" cy="20" r="1.4" fill="currentColor" />
            </svg>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -end-1 min-w-[18px] h-[18px] rounded-full bg-signal text-white text-[10px] font-bold flex items-center justify-center px-1"
              >
                {count}
              </motion.span>
            )}
          </Link>
          <button
            onClick={toggle}
            aria-label="Toggle language"
            className="text-xs font-bold tracking-widest2 text-white border border-white/25 rounded-full px-3 py-1.5 hover:bg-white hover:text-ink transition-all hover:scale-105"
          >
            {lang === "ar" ? "EN" : "عربي"}
          </button>
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="lg:hidden border-t border-white/10 bg-ink px-5 py-4 flex flex-col gap-4 overflow-hidden"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium ${pathname === l.href ? "text-white" : "text-mist hover:text-white"}`}
            >
              {l.label}
            </Link>
          ))}
        </motion.div>
      )}
    </header>
  );
}
