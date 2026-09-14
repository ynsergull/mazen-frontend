import type { NextConfig } from "next";

// Tarayici -> /api/v1/* istekleri Laravel'e proxy'lenir (prod'da Nginx ayni isi yapar: tek origin, CORS yok)
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Laravel public disk (yerel WebP varyantlari)
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/storage/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/storage/**" },
      // Tedarikci CDN (gorsel henuz indirilmemisse dogrudan)
      { protocol: "https", hostname: "d1y8qveuwztoxr.cloudfront.net", pathname: "/**" },
    ],
  },
  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: `${BACKEND_URL}/api/v1/:path*` },
      // Sanctum CSRF cookie ucu (giris/kayit ve tum yazma istekleri oncesi)
      { source: "/sanctum/:path*", destination: `${BACKEND_URL}/sanctum/:path*` },
    ];
  },
};

export default nextConfig;
