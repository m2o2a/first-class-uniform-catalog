"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { phones, landline, telLink, whatsappLink } from "@/lib/contact";

export default function Footer() {
  const { t, lang } = useLang();

  return (
    <footer className="relative bg-ink text-white overflow-hidden">
      <div className="pointer-events-none absolute -bottom-24 start-1/4 w-[40vw] h-[40vw] rounded-full bg-royal/15 blur-[120px]" />
      <hr className="stitch stitch-light relative z-10" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Image src="/logo/logo.png" alt="First Class" width={34} height={34} />
            <span className="font-display font-bold">FIRST CLASS FOR UNIFORM</span>
          </div>
          <p className="text-mist text-sm max-w-sm">
            {lang === "ar"
              ? "حلول يونيفورم فاخرة لكل قطاع، منذ 2009."
              : "Premium uniform solutions for every sector, since 2009."}
          </p>
          <div className="flex gap-2 mt-5">
            {["#16308C", "#D62828", "#C9A24B", "#12141A"].map((c) => (
              <span key={c} className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs tracking-widest2 text-signal font-bold mb-3">
            {lang === "ar" ? "روابط سريعة" : "QUICK LINKS"}
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/sections", label: t.nav.sections },
              { href: "/all-products", label: t.nav.allProducts },
              { href: "/projects", label: t.nav.projects },
              { href: "/clients", label: t.nav.clients }
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-mist hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-widest2 text-signal font-bold mb-3">
            {t.contact.phones.toUpperCase()}
          </h4>
          <ul className="space-y-2 text-sm mb-5">
            {phones.map((p) => (
              <li key={p}>
                <a href={telLink(p)} dir="ltr" className="text-mist hover:text-white transition-colors">
                  {p}
                </a>
              </li>
            ))}
            <li>
              <a href={telLink(landline)} dir="ltr" className="text-mist hover:text-white transition-colors">
                {landline}
              </a>
            </li>
          </ul>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-white text-ink text-sm font-semibold px-5 py-2.5 hover:bg-mist hover:scale-105 transition-all"
          >
            {t.contact.whatsapp}
          </a>
        </div>
      </div>
      <div className="relative z-10 border-t border-white/10 py-5 text-center text-xs text-mist">
        © {new Date().getFullYear()} First Class For Uniform — {t.footer.rights}
      </div>
    </footer>
  );
}
