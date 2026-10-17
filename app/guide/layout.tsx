import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "دليل طلب اليونيفورم — المقاسات والعناية والأسئلة الشائعة",
  description: "إزاي تطلب يونيفورم صح من أول مرة: خطوات الطلب، جدول مقاسات تقريبي، نصايح العناية بالتطريز، وإجابات الأسئلة الشائعة عن الكمية والتسليم والعينات.",
  path: "/guide"
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
