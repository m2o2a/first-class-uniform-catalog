"use client";

import { whatsappLink } from "@/lib/contact";
import { useLang } from "@/lib/lang-context";

export default function WhatsAppFloat() {
  const { lang } = useLang();
  return (
    <a
      href={whatsappLink(lang === "ar" ? "مرحبًا، حابب أعرف أكتر عن منتجاتكم" : "Hi, I'd like to know more about your uniforms")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-5 end-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-black/20 hover:scale-105 transition-transform"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.86.5 3.6 1.36 5.1L2 22l5.06-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.1c-1.6 0-3.1-.43-4.4-1.2l-.31-.18-3 .79.8-2.93-.2-.3A8.1 8.1 0 1 1 20.1 12c0 4.47-3.63 8.1-8.1 8.1zm4.4-6.06c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.43-.58 1.63-1.15.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28z" />
      </svg>
    </a>
  );
}
