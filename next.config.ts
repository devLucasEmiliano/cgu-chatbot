import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow development requests from your LAN device to Next.js internal assets
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
  allowedDevOrigins: [
    "192.168.1.11", // device IP observed in dev warning
  ],
  output: "standalone",
};

export default nextConfig;
