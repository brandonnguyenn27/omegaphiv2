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
    // Only use Flask proxy in development
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/python/:path*",
          destination: "http://127.0.0.1:5328/:path*", // Proxy to Flask Backend (local only)
        },
      ];
    }

    // In production, let Vercel handle Python functions directly
    return [];
  },
};

export default nextConfig;
