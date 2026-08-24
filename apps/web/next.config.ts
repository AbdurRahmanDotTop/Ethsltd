import type { NextConfig } from "next";

const nextConfig: any = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["@ethsltd/api-client", "@ethsltd/types"],
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
