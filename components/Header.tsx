"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLang } from "@/lib/lang-context";

export default function Header() {
  const { t, lang, toggle } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
          <Image
            src="/logo/logo.png"
            alt="First Class For Uniform"
            width={36}
            height={36}
            className="transition-transform duration-300 group-hover:rotate-[8deg]"
          />
          <span className="text-white font-display font-bold tracking-wide text-sm sm:text-base">
            FIRST CLASS
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
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

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle language"
            className="text-xs font-bold tracking-widest2 text-white border border-white/25 rounded-full px-3 py-1.5 hover:bg-white hover:text-ink transition-all hover:scale-105"
          >
            {lang === "ar" ? "EN" : "عربي"}
          </button>
          <button
            className="md:hidden text-white p-2"
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
          className="md:hidden border-t border-white/10 bg-ink px-5 py-4 flex flex-col gap-4 overflow-hidden"
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
