import type { Metadata } from "next";

export const metadata: Metadata = { title: "سلة الطلبات" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
