import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "عملاؤنا وشركاء النجاح",
  description: "الشركات والجهات اللي صنّعت لها فرست كلاس لليونيفورم في قطاعات الأمن والمستشفيات والفنادق والمطاعم والمصانع.",
  path: "/clients"
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
