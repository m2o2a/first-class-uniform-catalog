import { getFacebookPosts } from "@/lib/facebook";
import NewsFeed from "@/components/NewsFeed";

export const revalidate = 600;

export const metadata = {
  title: "أخبارنا وشغلنا | First Class For Uniform",
  description: "آخر أعمال ومنتجات فرست كلاس لليونيفورم"
};

export default async function NewsPage() {
  const posts = await getFacebookPosts(30);
  return <NewsFeed posts={posts} />;
}
