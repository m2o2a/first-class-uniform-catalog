"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import PageBanner from "@/components/PageBanner";
import type { FbPost } from "@/lib/facebook";

function PostCard({ p, i, ar }: { p: FbPost; i: number; ar: boolean }) {
  const [open, setOpen] = useState(false);
  const [img, setImg] = useState(0);
  const long = p.message.length > 220;
  const date = new Date(p.created).toLocaleDateString(ar ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
      className="rounded-2xl border border-line bg-white overflow-hidden flex flex-col"
    >
      {p.images.length > 0 && (
        <div className="relative aspect-square bg-paper">
          {/* صور فيسبوك من سيرفراتهم مباشرة */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.images[img]} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          {p.images.length > 1 && (
            <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5">
              {p.images.slice(0, 10).map((_, k) => (
                <button
                  key={k}
                  aria-label={`${k + 1}`}
                  onClick={() => setImg(k)}
                  className={`w-2 h-2 rounded-full ${k === img ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-steel text-xs mb-2">{date}</p>
        {p.message && (
          <p className="text-ink text-sm leading-7 whitespace-pre-line">
            {long && !open ? p.message.slice(0, 220) + "…" : p.message}
          </p>
        )}
        <div className="mt-auto pt-4 flex items-center justify-between gap-3">
          {long && (
            <button onClick={() => setOpen(!open)} className="text-royal text-xs font-semibold">
              {open ? (ar ? "أقل" : "Less") : ar ? "اقرأ أكتر" : "Read more"}
            </button>
          )}
          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="ms-auto text-xs font-semibold text-[#1877F2] hover:underline"
          >
            {ar ? "على فيسبوك ←" : "On Facebook →"}
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export default function NewsFeed({ posts }: { posts: FbPost[] }) {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <>
      <PageBanner
        eyebrow={ar ? "من صفحتنا على فيسبوك" : "From our Facebook page"}
        title={ar ? "أخبارنا وشغلنا" : "News & recent work"}
        sub={ar ? "آخر الطلبيات والموديلات اللي بننفذها" : "Our latest orders and designs"}
      />
      <section className="py-14 sm:py-20 bg-paper min-h-[40vh]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          {posts.length === 0 ? (
            <p className="text-center text-steel">
              {ar ? "قريب هتلاقي هنا آخر أخبارنا." : "Our latest news will appear here soon."}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((p, i) => (
                <PostCard key={p.id} p={p} i={i} ar={ar} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
