"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useLang } from "@/lib/lang-context";

export default function Header() {
  const { t, lang, toggle } = useLang();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/sections", label: t.nav.sections },
    { href: "/projects", label: t.nav.projects },
    { href: "/clients", label: t.nav.clients },
    { href: "/contact", label: t.nav.contact }
  ];

  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo/logo.png" alt="First Class For Uniform" width={36} height={36} />
          <span className="text-white font-display font-bold tracking-wide text-sm sm:text-base">
            FIRST CLASS
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-mist hover:text-white text-sm font-medium transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle language"
            className="text-xs font-bold tracking-widest2 text-white border border-white/25 rounded-full px-3 py-1.5 hover:bg-white hover:text-ink transition-colors"
          >
            {lang === "ar" ? "EN" : "عربي"}
          </button>
          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-ink px-5 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-mist hover:text-white text-sm font-medium"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
