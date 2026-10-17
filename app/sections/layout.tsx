import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "أقسام اليونيفورم حسب القطاع والصنف",
  description: "كل أقسام يونيفورم فرست كلاس: أمن، طبي، أطباء، تمريض، مطاعم، كافيهات، فنادق، شركات، مصانع، مقاولات، بترول، نظافة، مدارس وغيرها — مع بنطلونات وتيشيرتات وقمصان وجاكيتات ومرايل بتطريز لوجو شركتك.",
  path: "/sections"
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
