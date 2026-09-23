"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/lang-context";
import { whatsappLink } from "@/lib/contact";

const COLORS = [
  { name_ar: "كحلي", name_en: "Navy", hex: "#16308C" },
  { name_ar: "أسود", name_en: "Black", hex: "#12141A" },
  { name_ar: "رمادي", name_en: "Grey", hex: "#6B7280" },
  { name_ar: "أحمر", name_en: "Red", hex: "#D62828" },
  { name_ar: "أخضر", name_en: "Green", hex: "#1F6F43" },
  { name_ar: "بني", name_en: "Brown", hex: "#6B4A2E" },
  { name_ar: "بيج", name_en: "Beige", hex: "#C9B896" },
  { name_ar: "أبيض", name_en: "White", hex: "#F2F2F2" }
];

export default function ProductCustomizer({
  src,
  productName,
  open,
  onClose
}: {
  src: string;
  productName: string;
  open: boolean;
  onClose: () => void;
}) {
  const { lang } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState<string | null>(null);
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);
  const [logoPos, setLogoPos] = useState({ x: 0.5, y: 0.45 });
  const [logoScale, setLogoScale] = useState(0.22);
  const [dragging, setDragging] = useState(false);
  const [baseImg, setBaseImg] = useState<HTMLImageElement | null>(null);

  // Lead capture — name + phone required once per browser before a
  // customer can download or share their customized design.
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadError, setLeadError] = useState<string | null>(null);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const pendingActionRef = useRef<null | "download" | "share">(null);

  // load base product image
  useEffect(() => {
    if (!open) return;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => setBaseImg(img);
    return () => setBaseImg(null);
  }, [src, open]);

  // reset state on open
  useEffect(() => {
    if (open) {
      setColor(null);
      setLogo(null);
      setLogoPos({ x: 0.5, y: 0.45 });
      setLogoScale(0.22);
    }
  }, [open]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !baseImg) return;
    const size = 720;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    // cover-fit draw of base image
    const ratio = Math.max(size / baseImg.width, size / baseImg.height);
    const w = baseImg.width * ratio;
    const h = baseImg.height * ratio;
    const dx = (size - w) / 2;
    const dy = (size - h) / 2;
    ctx.drawImage(baseImg, dx, dy, w, h);

    // approximate color tint using multiply + soft overlay
    if (color) {
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.55;
      ctx.fillRect(0, 0, size, size);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(0, 0, size, size);
      ctx.globalCompositeOperation = "source-over";
    }

    // logo overlay
    if (logo) {
      const logoW = size * logoScale;
      const logoH = (logo.height / logo.width) * logoW;
      const lx = logoPos.x * size - logoW / 2;
      const ly = logoPos.y * size - logoH / 2;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 6;
      ctx.drawImage(logo, lx, ly, logoW, logoH);
      ctx.restore();
    }
  }, [baseImg, color, logo, logoPos, logoScale]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => setLogo(img);
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const posFromEvent = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    return { x, y };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!logo) return;
    setDragging(true);
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const p = posFromEvent(e.clientX, e.clientY);
    if (p) setLogoPos(p);
  };
  const onPointerUp = () => setDragging(false);

  const fileNameFor = (productName: string) => {
    const slug = productName
      .toString()
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "");
    return `first-class-for-uniform-${slug || "design"}.jpg`;
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = fileNameFor(productName);
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  };

  const [sharing, setSharing] = useState(false);

  const hasCapturedLead = () => {
    try {
      return typeof window !== "undefined" && localStorage.getItem("fc_lead_captured") === "1";
    } catch {
      return false;
    }
  };

  const requireLead = (action: "download" | "share") => {
    if (hasCapturedLead()) {
      action === "download" ? downloadImage() : shareToWhatsApp();
      return;
    }
    pendingActionRef.current = action;
    setLeadError(null);
    setLeadOpen(true);
  };

  const submitLead = async () => {
    if (!leadName.trim() || leadPhone.trim().length < 8) {
      setLeadError(
        lang === "ar" ? "من فضلك اكتب اسمك ورقم موبايل صحيح" : "Please enter your name and a valid phone number"
      );
      return;
    }
    setLeadSubmitting(true);
    setLeadError(null);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName.trim(),
          phone: leadPhone.trim(),
          product: productName,
          lang
        })
      });
      try {
        localStorage.setItem("fc_lead_captured", "1");
        localStorage.setItem("fc_lead_name", leadName.trim());
        localStorage.setItem("fc_lead_phone", leadPhone.trim());
      } catch {
        /* ignore storage errors */
      }
      setLeadOpen(false);
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      if (action === "download") downloadImage();
      else if (action === "share") shareToWhatsApp();
    } catch {
      setLeadError(lang === "ar" ? "حصل خطأ، حاول تاني" : "Something went wrong, please try again");
    } finally {
      setLeadSubmitting(false);
    }
  };

  // pre-fill from a previous session so returning customers don't retype
  useEffect(() => {
    try {
      setLeadName(localStorage.getItem("fc_lead_name") || "");
      setLeadPhone(localStorage.getItem("fc_lead_phone") || "");
    } catch {
      /* ignore */
    }
  }, [open]);

  const shareToWhatsApp = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSharing(true);
    try {
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.92)
      );
      if (!blob) throw new Error("no blob");
      const file = new File([blob], fileNameFor(productName), { type: "image/jpeg" });
      const shareText =
        lang === "ar"
          ? `First Class For Uniform — تصميم مقترح لـ ${productName}`
          : `First Class For Uniform — proposed design for ${productName}`;

      if (
        typeof navigator !== "undefined" &&
        "canShare" in navigator &&
        (navigator as any).canShare?.({ files: [file] })
      ) {
        await (navigator as any).share({
          files: [file],
          title: "First Class For Uniform",
          text: shareText
        });
      } else {
        // fallback: download the image, then open WhatsApp with the caption text
        downloadImage();
        window.open(whatsappLink(shareText + (lang === "ar" ? " (الصورة اتحملت — ارفقها هنا)" : " (image downloaded — attach it here)")), "_blank");
      }
    } catch (err) {
      // user cancelled share sheet or share failed — no-op
    } finally {
      setSharing(false);
    }
  };

  const t = {
    title: lang === "ar" ? "خصص المنتج" : "Customize Product",
    color: lang === "ar" ? "اختر اللون" : "Choose color",
    logo: lang === "ar" ? "ارفع اللوجو بتاعك" : "Upload your logo",
    dragHint:
      lang === "ar" ? "اسحب اللوجو لتحديد مكانه على المنتج" : "Drag the logo to position it on the product",
    size: lang === "ar" ? "حجم اللوجو" : "Logo size",
    note:
      lang === "ar"
        ? "معاينة تقريبية للشكل النهائي — الألوان والخامة الفعلية بتتحدد وقت الطلب"
        : "Approximate preview only — actual color & fabric confirmed at order time",
    download: lang === "ar" ? "تحميل المعاينة" : "Download preview",
    share: lang === "ar" ? "إرسال الصورة واتساب" : "Send image via WhatsApp",
    sharing: lang === "ar" ? "جارٍ التجهيز..." : "Preparing...",
    quote: lang === "ar" ? "اطلب عرض سعر بهذا التصميم" : "Request quote for this design",
    close: lang === "ar" ? "إغلاق" : "Close"
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl overflow-hidden w-full max-w-3xl max-h-[92svh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-line">
              <div>
                <p className="text-signal text-[11px] tracking-widest2 font-bold">FIRST CLASS FOR UNIFORM</p>
                <h3 className="font-display font-bold text-ink text-lg">
                  {t.title} — {productName}
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="close"
                className="w-9 h-9 rounded-full flex items-center justify-center text-steel hover:bg-paper transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-0">
              <div
                ref={containerRef}
                className="relative bg-paper flex items-center justify-center p-5"
              >
                <canvas
                  ref={canvasRef}
                  className="w-full max-w-[420px] aspect-square rounded-xl border border-line touch-none shadow-lg"
                  style={{ cursor: logo ? (dragging ? "grabbing" : "grab") : "default" }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerLeave={onPointerUp}
                />
              </div>

              <div className="p-5 sm:p-6 space-y-6">
                <div>
                  <p className="font-semibold text-ink text-sm mb-3">{t.color}</p>
                  <div className="flex flex-wrap gap-2.5">
                    {COLORS.map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setColor(color === c.hex ? null : c.hex)}
                        title={lang === "ar" ? c.name_ar : c.name_en}
                        className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 ${
                          color === c.hex ? "border-royal ring-2 ring-royal/30" : "border-white shadow"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        aria-label={c.name_en}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-ink text-sm mb-3">{t.logo}</p>
                  <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line hover:border-royal transition-colors cursor-pointer py-6 text-steel text-sm">
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    <span>{logo ? (lang === "ar" ? "تغيير اللوجو" : "Change logo") : (lang === "ar" ? "اضغط لرفع صورة" : "Click to upload image")}</span>
                  </label>
                  {logo && (
                    <>
                      <p className="text-steel text-xs mt-2">{t.dragHint}</p>
                      <div className="mt-3">
                        <label className="text-xs text-steel font-medium">{t.size}</label>
                        <input
                          type="range"
                          min={0.08}
                          max={0.45}
                          step={0.01}
                          value={logoScale}
                          onChange={(e) => setLogoScale(parseFloat(e.target.value))}
                          className="w-full accent-royal"
                        />
                      </div>
                    </>
                  )}
                </div>

                <p className="text-steel text-xs bg-paper rounded-lg p-3 border border-line">{t.note}</p>

                <div className="flex flex-col gap-2.5 pt-1">
                  <button
                    onClick={() => requireLead("share")}
                    disabled={sharing}
                    className="rounded-full bg-[#25D366] text-white text-sm font-semibold px-6 py-3 hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {sharing ? t.sharing : t.share}
                  </button>
                  <button
                    onClick={() => requireLead("download")}
                    className="rounded-full bg-ink text-white text-sm font-semibold px-6 py-3 hover:bg-royal transition-colors"
                  >
                    {t.download}
                  </button>
                  <a
                    href={whatsappLink(
                      lang === "ar"
                        ? `مرحبًا، عملت تصميم تقريبي لـ ${productName} وحابب أطلب عرض سعر بنفس الفكرة`
                        : `Hi, I made a design mockup for ${productName} and would like a quote for this concept`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-line text-ink text-sm font-semibold px-6 py-3 hover:bg-paper transition-colors text-center"
                  >
                    {t.quote}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {leadOpen && (
        <motion.div
          className="fixed inset-0 z-[110] bg-ink/85 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="bg-white rounded-2xl p-6 sm:p-7 w-full max-w-sm"
          >
            <p className="text-signal text-[11px] tracking-widest2 font-bold mb-1">FIRST CLASS FOR UNIFORM</p>
            <h3 className="font-display font-bold text-ink text-lg mb-2">
              {lang === "ar" ? "قبل ما تكمل..." : "Before you continue..."}
            </h3>
            <p className="text-steel text-sm mb-5">
              {lang === "ar"
                ? "سيبلنا اسمك ورقم موبايلك عشان نقدر نتابع معاك بخصوص التصميم ده."
                : "Leave your name and phone number so our team can follow up with you about this design."}
            </p>

            <div className="space-y-3">
              <input
                type="text"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder={lang === "ar" ? "الاسم" : "Name"}
                className="w-full rounded-xl border border-line px-4 py-3 text-sm text-ink focus:border-royal focus:outline-none"
              />
              <input
                type="tel"
                dir="ltr"
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
                placeholder={lang === "ar" ? "رقم الموبايل" : "Phone number"}
                className="w-full rounded-xl border border-line px-4 py-3 text-sm text-ink focus:border-royal focus:outline-none"
              />
              {leadError && <p className="text-signal text-xs">{leadError}</p>}
            </div>

            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setLeadOpen(false)}
                className="flex-1 rounded-full border border-line text-steel text-sm font-semibold px-5 py-3 hover:bg-paper transition-colors"
              >
                {t.close}
              </button>
              <button
                onClick={submitLead}
                disabled={leadSubmitting}
                className="flex-1 rounded-full bg-royal text-white text-sm font-semibold px-5 py-3 hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {leadSubmitting
                  ? lang === "ar"
                    ? "جارٍ الإرسال..."
                    : "Sending..."
                  : lang === "ar"
                  ? "متابعة"
                  : "Continue"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
