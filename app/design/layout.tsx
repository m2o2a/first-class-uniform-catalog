import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "صمم اليونيفورم بنفسك",
  description: "اختار موديل اليونيفورم، لوّنه باللون اللي يناسب شركتك، وحط اللوجو، وابعت التصميم لفرست كلاس لليونيفورم على واتساب.",
  path: "/design"
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
