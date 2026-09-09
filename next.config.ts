import type { NextConfig } from "next";

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
};

export default nextConfig;
