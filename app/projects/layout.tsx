import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "سابقة الأعمال في تصنيع اليونيفورم",
  description: "سابقة أعمال فرست كلاس لليونيفورم حسب القطاع: أمن، مستشفيات، مطاعم وكافيهات، نظافة، بترول، مقاولات وفنادق، ومصانع.",
  path: "/projects"
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
