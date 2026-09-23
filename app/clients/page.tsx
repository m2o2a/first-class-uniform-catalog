"use client";

import { useLang } from "@/lib/lang-context";
import PageBanner from "@/components/PageBanner";
import ClientsSheets from "@/components/ClientsSheets";

export default function ClientsPage() {
  const { t } = useLang();

  return (
    <>
      <PageBanner eyebrow={t.clients.eyebrow} title={t.clients.title} sub={t.clients.sub} />
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <ClientsSheets />
        </div>
      </section>
    </>
  );
}
