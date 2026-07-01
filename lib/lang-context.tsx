"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { dictionary, Lang } from "./dictionary";

type LangContextType = {
  lang: Lang;
  toggle: () => void;
  t: typeof dictionary["ar"];
  dir: "rtl" | "ltr";
};

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("fc-lang") : null;
    if (saved === "ar" || saved === "en") setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("fc-lang", lang);
  }, [lang]);

  const value = useMemo<LangContextType>(
    () => ({
      lang,
      toggle: () => setLang((l) => (l === "ar" ? "en" : "ar")),
      t: dictionary[lang],
      dir: lang === "ar" ? "rtl" : "ltr"
    }),
    [lang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
