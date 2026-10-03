/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Vercel serves every product photo as WebP at the exact size the
    // screen needs — the biggest single speed win for this photo-heavy site.
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" }
    ]
  },
  compress: true
};

module.exports = nextConfig;
