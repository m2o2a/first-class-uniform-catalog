import HomePage from "@/components/HomePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "فرست كلاس لليونيفورم | تصنيع يونيفورم بتطريز لوجو شركتك",
  description:
    "مصنع فرست كلاس لتصنيع اليونيفورم في مصر منذ 2009 — يونيفورم أمن، طبي، مطاعم، فنادق، مصانع، مدارس وشركات بتطريز لوجو شركتك. اطلب عرض سعر أو صمم بنفسك.",
  path: "/",
  absoluteTitle: true
});

export default function Home() {
  return <HomePage />;
}
