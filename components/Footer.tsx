"use client";

import Image from "next/image";
import { useLang } from "@/lib/lang-context";
import { phones, landline, telLink, whatsappLink } from "@/lib/contact";

export default function Footer() {
  const { t, lang } = useLang();

  return (
    <footer className="bg-ink text-white">
      <hr className="stitch stitch-light" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Image src="/logo/logo.png" alt="First Class" width={34} height={34} />
            <span className="font-display font-bold">FIRST CLASS FOR UNIFORM</span>
          </div>
          <p className="text-mist text-sm max-w-xs">
            {lang === "ar"
              ? "حلول يونيفورم فاخرة لكل قطاع، منذ 2009."
              : "Premium uniform solutions for every sector, since 2009."}
          </p>
        </div>

        <div>
          <h4 className="text-xs tracking-widest2 text-signal font-bold mb-3">
            {t.contact.phones.toUpperCase()}
          </h4>
          <ul className="space-y-2 text-sm">
            {phones.map((p) => (
              <li key={p}>
                <a href={telLink(p)} className="text-mist hover:text-white transition-colors">
                  {p}
                </a>
              </li>
            ))}
            <li>
              <a href={telLink(landline)} className="text-mist hover:text-white transition-colors">
                {landline}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-widest2 text-signal font-bold mb-3">
            {t.nav.contact.toUpperCase()}
          </h4>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-white text-ink text-sm font-semibold px-5 py-2.5 hover:bg-mist transition-colors"
          >
            {t.contact.whatsapp}
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-mist">
        © {new Date().getFullYear()} First Class For Uniform — {t.footer.rights}
      </div>
    </footer>
  );
}
