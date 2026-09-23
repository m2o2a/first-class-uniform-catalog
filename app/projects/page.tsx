"use client";

import { useLang } from "@/lib/lang-context";
import PageBanner from "@/components/PageBanner";
import SectionHeading from "@/components/SectionHeading";
import SectorGrid from "@/components/SectorGrid";
import ClientsSheets from "@/components/ClientsSheets";

export default function ProjectsPage() {
  const { t } = useLang();

  return (
    <>
      <PageBanner eyebrow={t.projects.eyebrow} title={t.projects.title} sub={t.projects.sub} />

      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectorGrid />
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-paper border-t border-line">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <SectionHeading eyebrow={t.clients.eyebrow} title={t.clients.title} sub={t.clients.sub} />
          <ClientsSheets />
        </div>
      </section>
    </>
  );
}
