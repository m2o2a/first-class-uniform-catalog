import { getFacebookPosts } from "@/lib/facebook";
import NewsFeed from "@/components/NewsFeed";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 600;

export const metadata = pageMetadata({
  title: "أخبارنا وشغلنا",
  description: "آخر أعمال ومنتجات فرست كلاس لليونيفورم من صفحتنا على فيسبوك.",
  path: "/news"
});

export default async function NewsPage() {
  const posts = await getFacebookPosts(30);
  return <NewsFeed posts={posts} />;
}
