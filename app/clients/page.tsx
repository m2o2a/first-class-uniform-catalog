"use client";

import { useLang } from "@/lib/lang-context";
import SectionHeading from "@/components/SectionHeading";
import ClientsSheets from "@/components/ClientsSheets";

export default function ClientsPage() {
  const { t } = useLang();

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading eyebrow={t.clients.eyebrow} title={t.clients.title} sub={t.clients.sub} />
        <ClientsSheets />
      </div>
    </section>
  );
}
