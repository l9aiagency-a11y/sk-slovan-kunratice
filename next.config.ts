import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "skslovankunratice.cz",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "xpzotpuzhzdrvecnhdfs.supabase.co",
      },
    ],
  },
};

export default nextConfig;
