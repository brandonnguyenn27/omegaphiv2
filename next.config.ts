import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/python/:path*",
        destination: "http://127.0.0.1:5328/:path*", // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
