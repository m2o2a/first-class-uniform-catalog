import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { LangProvider } from "@/lib/lang-context";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import QuoteFloatButton from "@/components/QuoteFloatButton";
import { SITE } from "@/lib/site";
import { phones } from "@/lib/contact";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "فرست كلاس لليونيفورم | تصنيع يونيفورم بتطريز لوجو شركتك",
    template: "%s | فرست كلاس لليونيفورم"
  },
  description:
    "مصنع فرست كلاس لتصنيع اليونيفورم في مصر منذ 2009 — يونيفورم أمن، طبي، مطاعم، فنادق، مصانع، مدارس وشركات بتطريز لوجو شركتك. اطلب عرض سعر أو صمم بنفسك.",
  keywords: [
    "يونيفورم", "مصنع يونيفورم", "تصنيع يونيفورم", "يونيفورم شركات", "يونيفورم امن", "يونيفورم طبي",
    "سكراب", "يونيفورم مطاعم", "يونيفورم فنادق", "افرول", "يونيفورم مصانع", "يونيفورم مدارس",
    "تطريز لوجو", "جاكت شيف", "يونيفورم القاهرة", "uniform factory Egypt"
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "فرست كلاس لليونيفورم",
    url: SITE,
    images: ["/logo/logo.png"]
  },
  robots: { index: true, follow: true },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION }
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "فرست كلاس لليونيفورم - First Class For Uniform",
  url: SITE,
  logo: `${SITE}/logo/logo.png`,
  image: `${SITE}/logo/logo.png`,
  telephone: phones.map((p) => "+2" + p),
  foundingDate: "2009",
  address: { "@type": "PostalAddress", addressLocality: "شبرا الخيمة", addressRegion: "القليوبية", addressCountry: "EG" },
  areaServed: "EG",
  description: "تصنيع يونيفورم الأمن والطبي والمطاعم والفنادق والمصانع والشركات بتطريز لوجو الشركة"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0D12"
};

const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-arabic antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <LangProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <WhatsAppFloat />
            <QuoteFloatButton />
          </CartProvider>
        </LangProvider>
        <Analytics />
        <SpeedInsights />
        {clarityId && (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${clarityId}");`}
          </Script>
        )}
      </body>
    </html>
  );
}
