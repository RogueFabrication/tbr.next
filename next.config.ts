import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.roguefab.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
