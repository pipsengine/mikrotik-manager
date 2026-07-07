import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@mikroktic-manager/shared", "@mikroktic-manager/ui"]
};

export default nextConfig;
