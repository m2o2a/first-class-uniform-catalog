import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "احسب سعر اليونيفورم",
  description: "احسب سعر تقريبي فوري لطلب اليونيفورم حسب الخامة والموديل والكمية وعدد اللوجوهات المطرزة، وابعت الطلب لفرست كلاس لليونيفورم.",
  path: "/quote"
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
