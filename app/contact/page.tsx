"use client";

import { useLang } from "@/lib/lang-context";
import SectionHeading from "@/components/SectionHeading";
import { phones, landline, telLink, whatsappLink } from "@/lib/contact";

export default function ContactPage() {
  const { t, lang } = useLang();

  const shareCatalog = async () => {
    const shareData = {
      title: "First Class For Uniform",
      text: lang === "ar" ? "شوف كتالوج فرست كلاس لليونيفورم" : "Check out the First Class Uniform catalog",
      url: typeof window !== "undefined" ? window.location.origin : ""
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* user cancelled */
      }
    } else if (typeof navigator !== "undefined") {
      await navigator.clipboard.writeText(shareData.url);
      alert(lang === "ar" ? "تم نسخ الرابط" : "Link copied");
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-white min-h-[70vh]">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading eyebrow={t.contact.eyebrow} title={t.contact.title} sub={t.contact.sub} />

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-[#25D366] text-white p-6 flex flex-col items-center gap-3 text-center hover:opacity-90 transition-opacity"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.86.5 3.6 1.36 5.1L2 22l5.06-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.1c-1.6 0-3.1-.43-4.4-1.2l-.31-.18-3 .79.8-2.93-.2-.3A8.1 8.1 0 1 1 20.1 12c0 4.47-3.63 8.1-8.1 8.1z" />
            </svg>
            <span className="font-semibold text-sm">{t.contact.whatsapp}</span>
          </a>

          <a
            href={telLink(phones[0])}
            className="rounded-2xl bg-ink text-white p-6 flex flex-col items-center gap-3 text-center hover:bg-royal transition-colors"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-semibold text-sm">{t.contact.call}</span>
          </a>

          <button
            onClick={shareCatalog}
            className="rounded-2xl border border-line text-ink p-6 flex flex-col items-center gap-3 text-center hover:border-royal transition-colors"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v14"
                stroke="#0B0E14"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-semibold text-sm">{t.contact.share}</span>
          </button>
        </div>

        <div className="rounded-2xl bg-paper border border-line p-6 sm:p-8">
          <h3 className="text-xs tracking-widest2 text-signal font-bold mb-4">
            {t.contact.phones.toUpperCase()}
          </h3>
          <ul className="grid sm:grid-cols-2 gap-3">
            {[...phones, landline].map((p) => (
              <li key={p}>
                <a
                  href={telLink(p)}
                  className="flex items-center gap-2 text-ink font-medium hover:text-royal transition-colors"
                  dir="ltr"
                >
                  {p}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
