import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "تواصل معنا — واتساب واتصال مباشر",
  description: "تواصل مع فرست كلاس لليونيفورم على واتساب أو بالتليفون لطلب عرض سعر يونيفورم لشركتك بتطريز اللوجو.",
  path: "/contact"
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
