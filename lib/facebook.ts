// بيجيب بوستات صفحة فرست كلاس من فيسبوك (Graph API) على السيرفر.
// محتاج متغيرين في Vercel: FB_PAGE_ID و FB_PAGE_TOKEN — شوف FACEBOOK_SETUP.md
// لو مش موجودين بيرجّع قايمة فاضية والموقع بيشتغل عادي.

export type FbPost = {
  id: string;
  message: string;
  created: string;
  images: string[];
  link: string;
};

type RawPost = {
  id: string;
  message?: string;
  created_time: string;
  full_picture?: string;
  permalink_url?: string;
  attachments?: {
    data?: {
      media?: { image?: { src?: string } };
      subattachments?: { data?: { media?: { image?: { src?: string } } }[] };
    }[];
  };
};

export async function getFacebookPosts(limit = 24): Promise<FbPost[]> {
  const pageId = process.env.FB_PAGE_ID;
  const token = process.env.FB_PAGE_TOKEN;
  if (!pageId || !token) return [];

  const fields =
    "message,created_time,full_picture,permalink_url,attachments{media,subattachments{media}}";
  const url = `https://graph.facebook.com/v21.0/${pageId}/posts?fields=${encodeURIComponent(
    fields
  )}&limit=${limit}&access_token=${token}`;

  try {
    // يتحدث كل 10 دقايق
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) {
      console.error("facebook posts error", res.status, await res.text());
      return [];
    }
    const json = (await res.json()) as { data?: RawPost[] };
    return (json.data || [])
      .map((p) => {
        const images: string[] = [];
        for (const a of p.attachments?.data || []) {
          for (const s of a.subattachments?.data || []) {
            if (s.media?.image?.src) images.push(s.media.image.src);
          }
          if (!images.length && a.media?.image?.src) images.push(a.media.image.src);
        }
        if (!images.length && p.full_picture) images.push(p.full_picture);
        return {
          id: p.id,
          message: p.message || "",
          created: p.created_time,
          images,
          link: p.permalink_url || `https://facebook.com/${p.id}`
        };
      })
      .filter((p) => p.message || p.images.length);
  } catch (e) {
    console.error("facebook posts failed", e);
    return [];
  }
}
